import * as httprequest from '../shared/util/httprequest';

export const getUser = async (userId) => {
    try {
        const response = await httprequest.get(`/users/${userId}`);
        return response;
    } catch (error) {
        console.log('Lỗi lấy thong tin user:', error);
        throw new Error('Đã xảy ra lỗi lấy thong tin user');
    }
};
