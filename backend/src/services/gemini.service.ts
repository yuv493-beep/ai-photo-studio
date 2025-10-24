import { GoogleGenAI, Modality, Type, FunctionDeclaration } from "@google/genai";

// This type needs to be compatible with what the frontend expects.
// It's defined here to avoid a direct dependency on frontend files.
interface GeneratedImage {
  src: string;
  alt: string;
}

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  throw new Error('GEMINI_API_KEY must be set in the server environment');
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const productCategories = [
  'Fashion & Apparel',
  'Shoes & Footwear',
  'Jewelry & Accessories',
  'Beauty & Cosmetics',
  'Electronics & Gadgets',
  'Home & Furniture',
  'Food & Beverages',
  'Bags & Luggage',
  'Toys & Kids’ Products',
  'Sports & Fitness Gear',
  'Other',
] as const;

export type ProductCategory = typeof productCategories[number];

export enum EditType {
  Ecommerce = 'E-Commerce',
  Catalog = 'Catalog / Lookbook',
  SocialMedia = 'Social Media',
  Advertising = 'Advertising / Campaign',
}

export async function identifyProductCategory(
  base64ImageData: string,
  mimeType: string,
): Promise<ProductCategory> {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `Analyze the product in this image and classify it into one of the following categories. Respond with JSON containing only the category name. The possible categories are: ${productCategories.join(', ')}.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { inlineData: { data: base64ImageData, mimeType: mimeType } },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING, description: 'The identified product category.', enum: [...productCategories] },
          },
          required: ['category'],
        },
      },
    });

    const result = JSON.parse(response.text.trim());
    if (result.category && productCategories.includes(result.category)) {
      return result.category as ProductCategory;
    }
    return 'Other';
  } catch (error) {
    console.error("Error identifying product category:", error);
    return 'Other'; // Default fallback
  }
}

export async function generateConcept(
  base64ImageData: string,
  mimeType: string,
  category: ProductCategory,
  editType: EditType,
  imageCount: number,
  customPrompt: string,
  includeModel: boolean
): Promise<{ theme: string; shots: string[] }> {
    const modelInstruction = includeModel
      ? 'The shot list should incorporate a human model where appropriate to demonstrate scale, context, and use.'
      : 'The shot list should focus exclusively on the product itself. Do not include any human models in the shot descriptions.';

    const model = 'gemini-2.5-flash';
    const prompt = `You are a world-class creative director for photography. An image of a "${category}" has been provided. The goal is to create a set of images for an "${editType}" campaign.

Based on the product, create a creative concept theme and a detailed shot list for exactly ${imageCount} unique and visually distinct images. The shots should be diverse and cover different angles, settings, and styles appropriate for the campaign type.

${modelInstruction}

${customPrompt ? `The user has provided this specific instruction: "${customPrompt}". Make sure to incorporate it.` : ''}

Return the response as a JSON object with two keys: "theme" (a short, catchy name for the concept, max 5 words) and "shots" (an array of strings, where each string is a detailed description of a single shot).`;

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [{ inlineData: { data: base64ImageData, mimeType: mimeType } }, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 0 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            theme: { type: Type.STRING, description: 'A short, catchy name for the creative concept.' },
            shots: { type: Type.ARRAY, description: `An array of exactly ${imageCount} detailed shot descriptions.`, items: { type: Type.STRING } },
          },
          required: ['theme', 'shots'],
        },
      },
    });

    const result = JSON.parse(response.text.trim());
    if (result.theme && result.shots && Array.isArray(result.shots)) {
      return result;
    }
    throw new Error("Failed to generate a valid concept from model.");
}

export async function editImage(
  base64ImageData: string,
  mimeType: string,
  prompt: string
): Promise<GeneratedImage[]> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64ImageData, mimeType: mimeType } },
          { text: prompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("No content generated. The response may have been blocked.");
    }

    const generatedImages: GeneratedImage[] = [];
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        generatedImages.push({
          src: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
          alt: "Generated product image",
        });
      }
    }
    
    if (generatedImages.length === 0) {
        throw new Error("The model did not return any images. Try adjusting your prompt.");
    }

    return generatedImages;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error(`Failed to generate images. ${error instanceof Error ? error.message : 'Please try again.'}`);
  }
}
