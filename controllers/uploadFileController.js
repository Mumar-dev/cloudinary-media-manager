const { request } = require("http");
const FileModel = require("../models/UploadFileModel");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const sharp = require("sharp")

async function localfileUpload(request, response) {
    try {
        const Allowed_extensions = [".jpg", ".jpeg", ".png"];

        if (!request.files || !request.files.file) {
            return response.status(400).send('No file was uploaded.');
        }

        const uploadFile = request.files.file;
        console.log(uploadFile)

        const File_extension = path.extname(uploadFile.name).toLowerCase();
        console.log(File_extension)


        const Uploadpath = path.join(__dirname, "tempFileFolder", Date.now() + File_extension);
        console.log(Uploadpath)

        if (!Allowed_extensions.includes(File_extension)) {
            return response.status(400).send({ 
                message: "Invalid file type." 
            });
        }

        uploadFile.mv(Uploadpath, (error) => {
            if (error) {
                console.log(error);
                return response.status(500).send({
                    message: "Error while uploading the file."
                });
            }

            response.status(200).json({
                message: 'File uploaded and saved to the server'
            });
        });

        try {
            // Save file details to the database
            const DatabaseFileSave = new FileModel({
                url: `http://localhost:4000/api/v1/upload/${path.basename(Uploadpath)}`,
                public_id: path.basename(Uploadpath),
                media_type: request.body.media_type,
                email: request.body.email,
                created_at: new Date()
            });

            const idkthename = await DatabaseFileSave.save();

            // Send success response after DB save
            response.status(200).json({
                message: "File uploaded and saved successfully.",
                file : idkthename
            });

        } catch (dbError) {
            console.log("Error while saving file details:", dbError);
            response.status(500).send({
                message: "Error saving file details to the database."
            });
        }


    } catch (error) {
        console.log(error);
        response.status(500).send({ 
            message: "Error saving file details to the database" 
        });
    }
}


async function ImageUpload(request, response) {
    try {
        const { public_id, email, media_type } = request.body;
        const uploadedImage = request.files.imageFile;
        console.log(uploadedImage)

        if (!uploadedImage) {
            return response.status(400).send('No file was uploaded.');
        }

        const Allowed_extensions = [".jpg", ".jpeg", ".png", ".webp"];
        const uploadedImage_extension = path.extname(uploadedImage.name).toLowerCase();

        if (!Allowed_extensions.includes(uploadedImage_extension)) {
            return response.status(400).json({ message: "Invalid file type." });
        }


        const TempFile_path = path.join(__dirname, "tempFileFolder", Date.now() + uploadedImage_extension);
        console.log("Temp file path:", TempFile_path);

        
        uploadedImage.mv(TempFile_path, async (error) => {
            if (error) {
                console.log(error);
                return response.status(500).json({ message: "Error while saving the file." });
            }

            try {
                
                const Cloudinaryfolder = "MyCloudinaryFolder";
                const uploadedImageToCloudinary = await cloudinary.uploader.upload(TempFile_path, {
                    folder: Cloudinaryfolder,
                    public_id: public_id,  
                    use_filename: true,
                });

                console.log("Cloudinary Upload Success:", uploadedImageToCloudinary);


                // ✅ Save to MongoDB
                const SaveImageToDatabase = new FileModel({
                    public_id: public_id, // Comes from request body
                    email: email,         // Comes from request body
                    media_type: media_type, // Comes from request body
                    url: uploadedImageToCloudinary.secure_url // From Cloudinary
                });

                await SaveImageToDatabase.save();

                return response.json({
                    success: true,
                    message: "Image uploaded and saved successfully!",
                    data: SaveImageToDatabase
                });
            } catch (uploadError) {
                console.log(uploadError);
                return response.status(500).json({ message: "Error uploading to Cloudinary." });
            }
        });
    } catch (error) {
        console.log("Error:", error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
}

async function VideoUpload(request, response) {
    try {
        console.log("🔥 Request received for video upload.");

        const { public_id, email, media_type } = request.body;
        const uploadedVideo = request.files.videoFile;
        console.log(uploadedVideo);

        if (!uploadedVideo) {
            return response.status(400).send('No file was uploaded.');
        }

        const Allowed_extensions = [".mp4", ".avi", ".mov", ".mkv", ".ts"]; 
        const uploadedVideo_extension = path.extname(uploadedVideo.name).toLowerCase();
        console.log(uploadedVideo_extension);

        if (!Allowed_extensions.includes(uploadedVideo_extension)) {
            return response.status(400).json({ message: "Invalid file type." });
        }

        // ✅ File size restriction (Max 5MB)
        const MAX_SIZE = 14 * 1024 * 1024; // 5MB in bytes
        if (uploadedVideo.size > MAX_SIZE) {
            return response.status(400).json({ message: "File size exceeds 5MB limit." });
        }

        const TempFile_path = path.join(__dirname, "tempFileFolder", Date.now() + uploadedVideo_extension);
        console.log("Temp file path:", TempFile_path);

        uploadedVideo.mv(TempFile_path, async (error) => {
            if (error) {
                console.log(error);
                return response.status(500).json({ message: "Error while saving the file." });
            }

            try {
                const Cloudinaryfolder = "MyCloudinaryVideos";
                const uploadedVideoToCloudinary = await cloudinary.uploader.upload(TempFile_path, {
                    folder: Cloudinaryfolder,
                    resource_type: "video",
                    public_id: public_id,  
                    use_filename: true,
                });

                console.log("Cloudinary Upload Success:", uploadedVideoToCloudinary);

                // ✅ Save to MongoDB
                const SaveVideoToDatabase = new FileModel({
                    public_id: public_id,
                    email: email,
                    media_type: media_type,
                    url: uploadedVideoToCloudinary.secure_url 
                });

                await SaveVideoToDatabase.save();

                return response.json({
                    success: true,
                    message: "Video uploaded and saved successfully!",
                    data: SaveVideoToDatabase
                });

            } catch (uploadError) {
                console.log(uploadError);
                return response.status(500).json({ message: "Error uploading to Cloudinary." });
            }
        });

    } catch (error) {
        console.log("Error:", error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
}

// async function CompressedImageUpload(request, response) {
//     try {
//         const { public_id, email, media_type } = request.body;
//         const uploadedImage = request.files?.imageFile;

//         if (!uploadedImage) {
//             return response.status(400).json({ message: "No file was uploaded." });
//         }

//         const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
//         const uploadedImageExt = path.extname(uploadedImage.name).toLowerCase();

//         if (!allowedExtensions.includes(uploadedImageExt)) {
//             return response.status(400).json({ message: "Invalid file type." });
//         }

//         // 📌 Prevent processing very large images (e.g., >5MB)
//         if (uploadedImage.size > 5 * 1024 * 1024) {
//             return response.status(400).json({ message: "File size exceeds the 5MB limit." });
//         }

//         try {
//             // 🟢 Compress and Resize Image using Sharp (No temp file needed)
//             const compressedBuffer = await sharp(uploadedImage.data)
//                 .resize({ width: 800 }) // Resize width to 800px
//                 .jpeg({ quality: 80 }) // Compress JPEG with 80% quality
//                 .toBuffer();

//             // 🟢 Upload directly to Cloudinary using buffer
//             const uploadedImageToCloudinary = await cloudinary.uploader.upload_stream(
//                 { folder: "MyCloudinaryFolder", public_id, use_filename: true },
//                 async (error, result) => {
//                     if (error) {
//                         console.error("Cloudinary Upload Error:", error);
//                         return response.status(500).json({ message: "Error uploading to Cloudinary." });
//                     }

//                     // ✅ Save to MongoDB
//                     const savedImage = new FileModel({
//                         public_id,
//                         email,
//                         media_type,
//                         url: result.secure_url,
//                     });

//                     await savedImage.save();

//                     return response.json({
//                         success: true,
//                         message: "Image compressed, uploaded, and saved successfully!",
//                         data: savedImage,
//                     });
//                 }
//             );

//             uploadedImageToCloudinary.end(compressedBuffer); // Send buffer to Cloudinary

//         } catch (uploadError) {
//             console.error("Error processing image:", uploadError);
//             return response.status(500).json({ message: "Error processing image." });
//         }
//     } catch (error) {
//         console.error("Error:", error);
//         return response.status(500).json({ message: "Internal Server Error" });
//     }
// }




module.exports = { localfileUpload, ImageUpload, VideoUpload };
