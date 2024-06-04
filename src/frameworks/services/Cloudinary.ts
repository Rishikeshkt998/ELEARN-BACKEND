import { v2 as cloudinary } from 'cloudinary';
import Icloudinary from '../../useCase/interface/Icloudinary';
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
});
class Cloudinary implements Icloudinary{
    async savetocloudinary(file: string): Promise<any> {
        const cloudinaryUploadResponse = await cloudinary.uploader.upload(file);
        const cloudinaryAttachmentUrl = cloudinaryUploadResponse.secure_url;
        return cloudinaryAttachmentUrl
    }
}

export default Cloudinary