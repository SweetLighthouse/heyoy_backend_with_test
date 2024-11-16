import { handleEditUser } from "../../../src/controllers/userController";
import userService from "../../../src/services/userService";

jest.mock("../../../src/services/userService");

describe('handleEditUser', () => {
    let req;
    let res;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };
    });

    it('nên trả về lỗi nếu email để trống', async () => {
        req.body = { name: 'Some Name' };

        await handleEditUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            errCode: 1,
            message: 'Email is required to edit user',
        });
    });

    it('nên tạo thành công user mới', async () => {
        req.body = { email: 'someone@example.com', name: 'Some Name' };
        const mockResponse = { id: '123', name: 'Some Name', email: 'someone@example.com' };
        userService.editInfoUser.mockResolvedValue(mockResponse);

        await handleEditUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockResponse);
    });

    it('nên trả về lỗi server', async () => {
        req.body = { email: 'someone@example.com', name: 'Some Name' };
        userService.editInfoUser.mockRejectedValue(new Error('Database error'));

        await handleEditUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            errCode: -1,
            message: 'Error from server',
        });
    });
});