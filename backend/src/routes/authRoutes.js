const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Validações para registro
const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .isLength({ min: 3 })
    .withMessage('Nome deve ter no mínimo 3 caracteres'),
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter no mínimo 6 caracteres'),
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('As senhas não coincidem'),
];

// Validações para login
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Senha é obrigatória'),
];

// Rotas
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);

// Rota protegida de teste
router.get('/me', authMiddleware, (req, res) => {
  res.json({
    message: 'Rota protegida acessada com sucesso',
    userId: req.userId,
  });
});

module.exports = router;
