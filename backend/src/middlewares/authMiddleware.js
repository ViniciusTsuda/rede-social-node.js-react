const jwt = require('jsonwebtoken');

// Middleware para verificar token JWT
const authMiddleware = (req, res, next) => {
  try {
    // Pegar o token do header Authorization
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    // Verificar e decodificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token inválido' });
    }
    res.status(500).json({ message: 'Erro ao verificar token' });
  }
};

module.exports = authMiddleware;
