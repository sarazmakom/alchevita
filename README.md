# 🍃 Alchevita App 🍃

**Alchevita App** is a web application that helps users explore, bookmark, and manage natural remedies based on specific symptoms. It was built as a capstone project for a web development bootcamp and serves as a wellness-focused digital tool with a modern UI and secure backend.

---

## 🚀 Features

- 🔍 **Filter remedies by symptoms**
- ❤️ **Bookmark favorite remedies**
- 📝 **Create, update, and delete personal remedies**
- 🖼️ **Upload images via Cloudinary**
- 👤 **User authentication & ownership**
- 📱 **Responsive UI for mobile and desktop**

---

## 🛠️ Tech Stack

| Area | Technology |
|------|------------|
| **Frontend** | Next.js, React, Styled-Components, SWR |
| **Backend**  | Next.js API Routes, MongoDB, Mongoose |
| **Authentication** | NextAuth.js |
| **Image Uploads** | Cloudinary + Formidable |
---
## 🧪 Key Technical Details

### 🗂️ MongoDB + Mongoose
- Defined schemas for:
  - `Remedy` — contains title, ingredients, preparation, symptoms, image, and owner ID.
  - `Symptom` — simple name-based schema.
  - `BookmarkRemedy` — maps user–remedy relationships.
  - `User` — with email, name, and GitHub ID.

### 🧮 Next.js API Routes
- CRUD operations for `Remedies`, `Bookmarks`, `Symptoms`
- Aggregation Pipelines to:
  - Filter remedies by symptom
  - Attach bookmarked state per user
  - Populate symptom names while maintaining order

### 🔐 Authentication with NextAuth.js
- Session-based access
- Restrict actions (like edit/delete remedies) to their owner only

### ☁️ Cloudinary Uploads
- Via `/api/upload` route
- `formidable` to parse incoming files
- Secure and size-limited uploads

### ⚡ Optimistic UI via SWR
- `useBookmarks()` custom hook for optimistic toggling
- Instant feedback when user bookmarks/unbookmarks a remedy

### 🎨 Styled Components
- Responsive layout with fixed mobile navbar
- Dark/light mode support 
- Modular, component-level CSS

