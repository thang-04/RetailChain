import { axiosPrivate } from './api/axiosClient';

const API_PATH = '/api/product/upload';

const uploadService = {
    uploadFile: async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axiosPrivate.post(API_PATH, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        // Backend returns JsonWithData, data contains the URL
        if (response && response.data) {
            return response.data; // Return the URL string
        }
        return response;
    }
};

export default uploadService;
