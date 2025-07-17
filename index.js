const express = require("express");
const dotenv = require("dotenv");
const connect_Database = require("./config/database");
const connect_Cloudinary = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const routes = require("./routes/UploadFileRoute");

dotenv.config();

const app = express(); // ✅ Define app here

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(fileUpload({ 
    useTempFiles: true, 
    tempFileDir: "./tempFileFolder/"
   }));
app.use("/api/v1/upload", routes);

// Connect to Database and Cloudinary
connect_Database();
connect_Cloudinary();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
