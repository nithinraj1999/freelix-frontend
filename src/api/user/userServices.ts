import userInstance from "../axiosInstance/userInstance";
export const refreshAccessToken = async () => {
    try {
        const response = await userInstance.get(`/refresh-token`, {
            withCredentials: true, // To include cookies for HttpOnly refresh token
        });
        const { accessToken } = response.data;

        if (!accessToken) {
            throw new Error('No access token returned from refresh token endpoint');
        }

        localStorage.setItem('userAccessToken', accessToken); // Store new access token in localStorage
        return accessToken;
    } catch (error) {
        // More detailed logging
        if (error) {
            console.error('Failed to refresh access token:', error);
        } else {
            console.error('Failed to refresh access token:', error);
        }
        throw error; // Propagate the error
    }
};