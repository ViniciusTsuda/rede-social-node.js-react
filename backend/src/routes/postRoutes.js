const express = require('express');
const { body } = require('express-validator');
const postController = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

// Validações para criar post
const createPostValidation = [
  body('description')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Descrição deve ter no máximo 1000 caracteres'),
];

// POST /api/posts - Criar novo post (com upload de imagem)
router.post(
  '/',
  authMiddleware,
  upload.single('image'),
  createPostValidation,
  postController.createPost
);

// GET /api/posts - Listar todos os posts
router.get('/', postController.getPosts);

// GET /api/posts/:id - Buscar post específico
router.get('/:id', postController.getPostById);

// DELETE /api/posts/:id - Deletar post (apenas dono)
router.delete('/:id', authMiddleware, postController.deletePost);

module.exports = router;
