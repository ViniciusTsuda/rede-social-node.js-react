const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');

class User {
  static async create(name, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  }

  static async findByEmail(email) {
    return prisma.users.findUnique({
      where: { email },
    });
  }

  static async findById(id) {
    return prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      },
    });
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;
