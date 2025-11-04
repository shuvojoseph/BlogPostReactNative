import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_TOKEN_KEY = 'ACCESS_TOKEN';
const REFRESH_TOKEN_KEY = 'REFRESH_TOKEN';
const USER_KEY = 'LOGGED_USER';

export const storage = {
  async setAccessToken(token: string) { await AsyncStorage.setItem(ACCESS_TOKEN_KEY, token); },
  async getAccessToken() { return AsyncStorage.getItem(ACCESS_TOKEN_KEY); },
  async setRefreshToken(token: string) { await AsyncStorage.setItem(REFRESH_TOKEN_KEY, token); },
  async getRefreshToken() { return AsyncStorage.getItem(REFRESH_TOKEN_KEY); },
  async clearTokens() {
    await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]);
  },
  async setUser(user: any) { await AsyncStorage.setItem(USER_KEY, JSON.stringify(user)); },
  async getUser() {
    const s = await AsyncStorage.getItem(USER_KEY);
    return s ? JSON.parse(s) : null;
  },
  async clearAll() {
    await AsyncStorage.clear();
  }
};
