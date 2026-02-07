const prisma = require('../config/prisma');

class Post {
  static async create(userId, imageUrl, description) {
    return prisma.posts.create({
      data: {
        user_id: userId,
        image_url: imageUrl,
        description,
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });
  }

  static async findAll() {
    return prisma.posts.findMany({
      include: {
        users: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  static async findById(id) {
    return prisma.posts.findUnique({
      where: { id: parseInt(id) },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });
  }

  static async deleteById(id) {
    return prisma.posts.delete({
      where: { id: parseInt(id) },
    });
  }

  static async findByUserId(userId) {
    return prisma.posts.findMany({
      where: { user_id: userId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}

module.exports = Post;
