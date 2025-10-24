// Fix: Corrected express import to resolve type errors with the response object.
import express from 'express';
import {
  generateConcept as generateConceptService,
  identifyProductCategory,
  editImage,
  EditType,
} from '../services/gemini.service';
import pool from '../db';
import { AppError } from '../middleware/errorHandler';

const checkPlanPermissions = async (userId: string, requestedEditType: EditType) => {
    if (!userId) {
        throw new AppError('Unauthorized', 401);
    }
    const subQuery = await pool.query(
        "SELECT plan_id FROM subscriptions WHERE user_id = $1 AND status = 'active'",
        [userId]
    );

    if (subQuery.rows.length === 0) {
        throw new AppError('No active subscription found.', 403);
    }
    const planId = subQuery.rows[0].plan_id;

    if (planId === 'starter' && requestedEditType !== EditType.Ecommerce) {
        throw new AppError('Your current plan only supports the E-Commerce style. Please upgrade to unlock more styles.', 403);
    }
};

// Fix: Use express.Response and express.NextFunction for correct type inference.
export const getConcept = async (req: any, res: express.Response, next: express.NextFunction) => {
  const userId = req.user?.uid;
  const { originalImage, editType, imageCount, customPrompt, includeModel } = req.body;

  if (!originalImage || !originalImage.base64 || !originalImage.file?.type) {
    return next(new AppError('Original image with file type is required', 400));
  }

  try {
    await checkPlanPermissions(userId, editType);
    
    const userQuery = await pool.query('SELECT is_verified FROM users WHERE firebase_uid = $1', [userId]);
    if (!userQuery.rows[0]?.is_verified) {
        return next(new AppError('Please verify your email to generate concepts.', 403));
    }

    const category = await identifyProductCategory(originalImage.base64, originalImage.file.type);
    const concept = await generateConceptService(
      originalImage.base64,
      originalImage.file.type,
      category,
      editType,
      parseInt(imageCount, 10) || 6,
      customPrompt,
      includeModel
    );
    res.json({ category, concept });
  } catch (err) {
    next(err);
  }
};

// Fix: Use express.Response and express.NextFunction for correct type inference.
export const generateImages = async (req: any, res: express.Response, next: express.NextFunction) => {
  const userId = req.user?.uid;
  if (!userId) return next(new AppError('Unauthorized', 401));

  const { originalImage, concept, category, editType, customPrompt, includeModel } = req.body;
  if (!originalImage || !originalImage.base64 || !concept || !category) {
    return next(new AppError('Image, concept, and category are required', 400));
  }

  const numImagesToGenerate = concept.shots.length;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await checkPlanPermissions(userId, editType);
    
    const userQuery = await client.query('SELECT credits, is_verified FROM users WHERE firebase_uid = $1 FOR UPDATE', [userId]);
    if (userQuery.rows.length === 0) {
        throw new AppError('User not found.', 404);
    }
    const user = userQuery.rows[0];

    if (!user.is_verified) {
        throw new AppError('Please verify your email to generate images.', 403);
    }
    if (user.credits < numImagesToGenerate) {
      throw new AppError('Not enough credits to perform this generation.', 402);
    }
    
    const basePrompts = {
      [EditType.Ecommerce]: `You are an expert e-commerce photographer. Based on the provided product image, generate a professional e-commerce-ready image. The image must be on a pure white background (#FFFFFF), be sharp, well-lit, and show the product accurately.`,
      [EditType.Catalog]: `You are an expert catalog photographer. Based on the provided product image, generate a professional catalog shot. An essential shot should be on a clean, minimalist, neutral background (like light gray or off-white) with even lighting. A lifestyle shot should place the product in a relevant, appealing setting.`,
      [EditType.SocialMedia]: `You are a creative social media content creator. Based on the provided product image, generate an engaging, authentic, and eye-catching social media image. The style should feel like high-quality user-generated content (UGC) or a behind-the-scenes shot, suitable for platforms like Instagram or Pinterest.`,
      [EditType.Advertising]: `You are a world-class advertising creative director. Based on the provided product image, generate a high-impact, aspirational advertising campaign image. This should be a 'hero' visual with dramatic lighting, a polished look, and a sense of luxury or excitement. The goal is to be exceptionally eye-catching and convey a strong brand message.`,
    };
    const basePrompt = basePrompts[editType as EditType];

    const generationPromises = concept.shots.map((shot: string, index: number) => {
      const modelInstruction = includeModel
        ? 'If appropriate for the shot, include a human model to add context and scale. The model should look natural and not distract from the product.'
        : 'Do NOT include any people or human models in the image. The focus should be solely on the product.';
      
      const singleShotPrompt = `${basePrompt}\n\n**Image Quality Mandate: The final image must be of the absolute highest photorealistic quality. It should look like it was taken with a professional DSLR camera with a prime lens. Pay extreme attention to realistic lighting, shadows, reflections, and textures. The image must be tack-sharp, well-composed, and have a clean, professional aesthetic.**\n\n**Critical Product Integrity Rule: The original product from the uploaded image MUST be preserved perfectly. Do NOT distort, modify, or change any details of the product itself, including its shape, color, branding, logos, and features. The goal is to place the *exact* same product into a new scene.**\n\nThe product is in the '${category}' category. Generate the following specific shot based on our creative concept: "${shot}".\n\n${modelInstruction}\n\nTo ensure visual variety, create a distinct composition for this shot. This is image ${index + 1} of ${concept.shots.length} in a series.\n\n${customPrompt ? `Also incorporate this custom request: "${customPrompt}".` : ''}\n\nReturn only a single, complete image. Do not return text.`;

      return editImage(originalImage.base64, originalImage.file.type, singleShotPrompt);
    });

    const resultsArray = await Promise.all(generationPromises);
    const generatedImages = resultsArray.flat();

    if (generatedImages.length === 0) {
      throw new AppError("The model did not return any images. Your credits were not used.", 500);
    }
    
    await client.query(
      `INSERT INTO generation_history (user_id, theme, original_image_base64, generated_images)
       VALUES ($1, $2, $3, $4)`,
      [userId, concept.theme, originalImage.base64, JSON.stringify(generatedImages)]
    );

    const updatedUser = await client.query(
      'UPDATE users SET credits = credits - $1 WHERE firebase_uid = $2 RETURNING credits',
      [numImagesToGenerate, userId]
    );

    await client.query('COMMIT');

    res.json({ generatedImages, newCredits: updatedUser.rows[0].credits });

  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
      client.release();
  }
};