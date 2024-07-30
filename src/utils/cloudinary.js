import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';


// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        }
        )
        // file has been uploaded successfully
        // console.log("File uploaded successfully", response.url);
        fs.unlinkSync(localFilePath)
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath)  // remove temporary file 
        return null;
    }
}

const getDataFromCloudinary = async (data) => {
    try {
        if (!data) return null;
        const response = await cloudinary.api.resources({ type: 'upload', prefix: data });
        return response;
    } catch (error) {
        return null;
    }
}

const deleteCloudinaryImage = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        const publicId = path.basename(localFilePath, path.extname(localFilePath));
        await cloudinary.uploader.destroy(publicId);
        fs.unlinkSync(localFilePath)
        return true;
    } catch (error) {
        fs.unlinkSync(localFilePath)  // remove temporary file 
        return false;
    }
}

export { uploadOnCloudinary, deleteCloudinaryImage }