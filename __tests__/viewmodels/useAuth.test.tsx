import { renderHook, act } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../../src/viewmodels/useAuth';
import  * as authService from '../../src/api/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('../../src/api/authService');

describe('useAuth hook', () => {
  it('logs in user and stores token', async () => {
    (authService.login as jest.Mock).mockResolvedValueOnce({
      token: 'jwt-token',
      refreshToken: 'refresh-token',
      user: { id: 1, email: 'user@deshiit.com' },
    });

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      await result.current.login({ email: 'user@deshiit.com', password: 'qwe1234' });
    });

    expect(await AsyncStorage.getItem('ACCESS_TOKEN')).toBe('jwt-token');
    expect(result.current.user?.email).toBe('user@deshiit.com');
  });
});
