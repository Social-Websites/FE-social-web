import * as httprequest from '../shared/util/httprequest';

export const getUserConversations = async (conversationId) => {
    try {
        const response = await httprequest.get(`/conversation/${conversationId}`);
        return response;
    } catch (error) {
        console.log('Lỗi lấy danh sách message:', error);
        throw new Error('Đã xảy ra lỗi lấy danh sách message');
    }
};
