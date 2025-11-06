import apiClient from './apiClient';
import { BlogPayload } from '../models/blog';

const blogService = {
  getBlogs: async () => {
    const res = await apiClient.get('/api/blogs');
    return res.data; // expect array
  },

  addBlog: async (payload: BlogPayload) => {
    const res = await apiClient.post('/api/blogs', payload);
    return res.data;
  },

  updateBlog: async (id: string, payload: BlogPayload) => {
    const res = await apiClient.put(`/api/blogs/${id}`, payload);
    return res.data;
  },

  deleteBlog: async (id: string) => {
    const res = await apiClient.delete(`/api/blogs/${id}`);
    return res.data;
  },

  getAllUsers: async () => {
    const res = await apiClient.get('/api/users'); // adjust to your endpoint that returns users
    return res.data;
  }
};

export default blogService;