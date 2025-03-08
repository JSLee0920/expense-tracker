import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";

const uploadImage = async (imageFile) => {
    const formData = new FormData();
    
    // Add timestamp to filename to avoid caching issues
    const timestamp = new Date().getTime();
    const fileName = `${timestamp}-${imageFile.name}`;
    
    // Create a new file object with the timestamped name
    const renamedFile = new File([imageFile], fileName, {
        type: imageFile.type
    });
    
    // Append renamed image file to form data
    formData.append('image', renamedFile);
    
    try {
        // Add cache-busting query parameter to URL
        const uploadUrl = `${API_PATHS.IMAGE.UPLOAD_IMAGE}?t=${timestamp}`;
        
        const response = await axiosInstance.post(uploadUrl, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            // Add timeout to prevent hanging requests
            timeout: 30000
        });
        
        return response.data;
    } catch (error) {
        console.error('Error uploading the image:', error);
        
        // Provide more specific error information if available
        if (error.response) {
            console.error('Server response:', error.response.status, error.response.data);
        }
        
        throw error;
    }
};

export default uploadImage;