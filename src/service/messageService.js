import * as httprequest from '../shared/util/httprequest';

export const getMessages = async (userId) => {
    try {
        const response = await httprequest.get(`/messages/${userId}`);
        return response;
    } catch (error) {
        console.log('Lỗi lấy thong tin user:', error);
        throw new Error('Đã xảy ra lỗi lấy thong tin user');
    }
};

export const sendMessage = async (data) => {
    try {
        const response = await httprequest.post(`/messages/send`, data);
        return response;
    } catch (error) {
        console.log('Lỗi lấy send message:', error);
        throw new Error('Đã xảy ra lỗi send message');
    }
};