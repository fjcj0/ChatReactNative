import { PUBLIC_EXPO_CLOUDAINRY_API_KEY, PUBLIC_EXPO_CLOUDAINRY_API_SECRET, PUBLIC_EXPO_CLOUDAINRY_NAME } from "@/local.config";
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
    cloud_name: PUBLIC_EXPO_CLOUDAINRY_NAME,
    api_key: PUBLIC_EXPO_CLOUDAINRY_API_KEY,
    api_secret: PUBLIC_EXPO_CLOUDAINRY_API_SECRET,
});
export default cloudinary;