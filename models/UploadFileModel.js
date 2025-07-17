const mongoose = require('mongoose');
const nodemailer = require("nodemailer");

const mediaSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,  // URL of the media (image or video)
    },
    public_id: {
        type: String,
        required: true,  // Public ID of the media in Cloudinary
    },
    media_type: {
        type: String,
        enum: ['image', 'video'],  // Media type to differentiate between image and video
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,  // Timestamp of when the media is uploaded
    },
    email: {
        type: String,
        required: true,  // Email of the user uploading the media
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
    }
});

    mediaSchema.post("save", async function ( doc ){
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST, 
            auth: {
              user: process.env.MAIL_USER, 
              pass: process.env.MAIL_PASS,
            },

          });

          const mailInfo = {
            from: process.env.MAIL_USER,
            to: doc.email, 
            subject: "Upload File To Cloudinary",
            text: "Hello, your file has been uploaded successfully. ✅",
          };

          try {
            // Send email
            await transporter.sendMail(mailInfo);
            console.log("✅ Email sent successfully.");
          } catch (error) {
            console.error("❌ Error sending email:", error);
          }
        
    })

const Media = mongoose.model('Media', mediaSchema);

module.exports = Media;
