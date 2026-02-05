const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const sequelize = require('./config/database');
const User = require('./models/User');

const app = express();

// Middlewares de segurança
app.use(helmet());
app.use(cors());

// Middlewares de parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (uploads)
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor rodando!' });
});

// Importar e usar rotas
app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/posts', require('./routes/postRoutes'));
// app.use('/api/likes', require('./routes/likeRoutes'));
// app.use('/api/comments', require('./routes/commentRoutes'));

// Middleware para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Erro interno do servidor',
  });
});

// Sincronizar banco de dados e iniciar servidor
const PORT = process.env.PORT || 5000;

sequelize.sync({ force: false }).then(() => {
  console.log('Banco de dados sincronizado!');
  
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}).catch((error) => {
  console.error('Erro ao sincronizar banco de dados:', error);
  process.exit(1);
});

module.exports = app;
