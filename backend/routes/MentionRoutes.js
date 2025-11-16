import express from 'express';
import { deleteMention, fetchAndSaveMentions, getMentionById, getMentions } from "../controller/mentionController.js";


const router = express.Router();

// POST /api/mentions/fetch - Fetch mentions from external sources
router.post('/fetch', fetchAndSaveMentions);

// GET /api/mentions - Get all mentions with filters
router.get('/', getMentions);

// GET /api/mentions/:id - Get single mention
router.get('/:id', getMentionById);

// DELETE /api/mentions/:id - Delete mention
router.delete('/:id', deleteMention);

export default router;