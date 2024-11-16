import { handleDeleteUser } from "../../../src/controllers/userController";
import userService from "../../../src/services/userService";

jest.mock("../../../src/services/userService");

describe('handleDeleteUser', () => {
    let req;
    let res;

    beforeEach(() => {
        req = { query: {} }; 
        res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };
    });

    it('nên trả về lỗi nếu không có id', async () => {
        req.query.id = undefined;

        await handleDeleteUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            errCode: 1,
            message: 'User id is required to delete user',
        });
    });

    it('nên xoá user thành công', async () => {
        req.query.id = '123';
        const mockResponse = { success: true };
        userService.deleteUser.mockResolvedValue(mockResponse);

        await handleDeleteUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);  // OK status for successful deletion
        expect(res.json).toHaveBeenCalledWith(mockResponse);
    });

    it('nên trả về lỗi server', async () => {
        req.query.id = '123';
        userService.deleteUser.mockRejectedValue(new Error('Database error'));

        await handleDeleteUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);  // Internal server error
        expect(res.json).toHaveBeenCalledWith({
            errCode: -1,
            message: 'Error from server',
        });
    });
});