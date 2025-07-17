# 📤 Cloudinary Media Manager

This project provides a simple and secure way to upload **images** and **videos** to [Cloudinary](https://cloudinary.com/), store their **secure URLs** in a database, and apply powerful **media transformations** such as resizing, changing quality, shape, and more.

## 🚀 Features

- Upload **images** and **videos** to Cloudinary
- Store secure Cloudinary URLs in a database
- Apply transformations:
  - Resize (width, height)
  - Quality adjustment
  - Cropping, shaping, and format changes
- Built with best practices in **security** and **performance**

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Cloud Storage**: Cloudinary
- **Database**: MongoDB
- **Middleware**: express-fileupload (for handling file uploads)

## 📷 Media Upload & Transform Flow

1. User uploads image/video
2. File is sent to Cloudinary via API
3. Cloudinary returns a secure URL
4. Secure URL is stored in the database
5. Media can be transformed using Cloudinary’s dynamic URL API (e.g., `/w_500,h_500,q_auto`)

## 🔐 Security

- Upload validation (file type and size)
- Use of Cloudinary’s secure URLs
- Environment variables for secrets

  1. Clone the repository:
     ```bash
   git clone https://github.com/Mumar-dev/cloudinary-media-manager.git
   cd cloudinary-media-manager

  2. Install dependencies:
     ```bash
     npm install

  3. npm run dev
    ```bash
    npm run dev

