import * as authService from '../../../src/api/authService';
import apiClient from '../../../src/api/apiClient';

jest.mock('../../../src/api/apiClient');

describe('authService', () => {
  it('calls login API with email and password', async () => {
    (apiClient.post as jest.Mock).mockResolvedValueOnce({ data: { token: 'abc', refreshToken: 'xyz' } });
    const res = await authService.login('test@example.com', 'password123');
    expect(apiClient.post).toHaveBeenCalledWith('/api/auth/login', { email: 'test@example.com', password: 'password123' });
    expect(res.token).toBe('abc');
  });
});
