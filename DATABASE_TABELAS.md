**1. users**
- id (PK, AUTO_INCREMENT)
- name (VARCHAR)
- email (VARCHAR, UNIQUE)
- password (VARCHAR)
- avatar (VARCHAR, nullable)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)

**2. posts**
- id (PK, AUTO_INCREMENT)
- user_id (FK -> users.id)
- image_url (VARCHAR)
- description (TEXT, nullable)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)

**3. likes**
- id (PK, AUTO_INCREMENT)
- user_id (FK -> users.id)
- post_id (FK -> posts.id)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
- UNIQUE(user_id, post_id)

**4. comments**
- id (PK, AUTO_INCREMENT)
- user_id (FK -> users.id)
- post_id (FK -> posts.id)
- content (TEXT)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)

### Índices:
- idx_email (users.email)
- idx_user_id_posts (posts.user_id)
- idx_post_id_likes (likes.post_id)
- idx_user_id_likes (likes.user_id)
- idx_post_id_comments (comments.post_id)
- idx_user_id_comments (comments.user_id)

---
