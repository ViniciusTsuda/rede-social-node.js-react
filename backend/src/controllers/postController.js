const Post = require('../models/Post');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

// Criar novo post
exports.createPost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Deletar arquivo se houver erro de validação
      if (req.file) {
        fs.unlinkSync(path.join('uploads', req.file.filename));
      }
      return res.status(400).json({ errors: errors.array() });
    }

    // Verificar se arquivo foi enviado
    if (!req.file) {
      return res.status(400).json({ message: 'Imagem é obrigatória' });
    }

    const { description } = req.body;
    const userId = req.userId;
    const imageUrl = `/uploads/${req.file.filename}`;

    // Criar post
    const newPost = await Post.create(userId, imageUrl, description || null);

    res.status(201).json({
      message: 'Post criado com sucesso',
      post: newPost,
    });
  } catch (error) {
    // Deletar arquivo em caso de erro
    if (req.file) {
      fs.unlinkSync(path.join('uploads', req.file.filename));
    }
    console.error('Erro ao criar post:', error);
    res.status(500).json({ message: 'Erro ao criar post', error: error.message });
  }
};

// Listar todos os posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.findAll();

    res.status(200).json({
      message: 'Posts recuperados com sucesso',
      count: posts.length,
      posts: posts,
    });
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    res.status(500).json({ message: 'Erro ao buscar posts', error: error.message });
  }
};

// Buscar post específico
exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post não encontrado' });
    }

    res.status(200).json({
      message: 'Post recuperado com sucesso',
      post: post,
    });
  } catch (error) {
    console.error('Erro ao buscar post:', error);
    res.status(500).json({ message: 'Erro ao buscar post', error: error.message });
  }
};

// Deletar post
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post não encontrado' });
    }

    // Verificar se o usuário é o dono do post
    if (post.user_id !== userId) {
      return res.status(403).json({ message: 'Você não tem permissão para deletar este post' });
    }

    // Deletar arquivo de imagem
    const imagePath = path.join('uploads', path.basename(post.image_url));
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Deletar post
    await Post.deleteById(id);

    res.status(200).json({
      message: 'Post deletado com sucesso',
    });
  } catch (error) {
    console.error('Erro ao deletar post:', error);
    res.status(500).json({ message: 'Erro ao deletar post', error: error.message });
  }
};
