import { Router } from 'express';
import { firebaseAuthMiddleware } from '../middleware/auth.middleware';
import { generateImages, getConcept } from '../controllers/studio.controller';

const router = Router();

// All studio routes are protected
router.use(firebaseAuthMiddleware);

router.post('/concept', getConcept);
router.post('/generate', generateImages);

export default router;
