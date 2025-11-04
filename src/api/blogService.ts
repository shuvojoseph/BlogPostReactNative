import apiClient from './apiClient';
import { BlogPayload } from '../models/blog';

const blogService = {
  getBlogs: async () => {
    const res = await apiClient.get('/api/Blogs');
    return res.data; // expect array
  },

  addBlog: async (payload: BlogPayload) => {
    const res = await apiClient.post('/api/Blogs', payload);
    return res.data;
  },

  updateBlog: async (id: string, payload: BlogPayload) => {
    const res = await apiClient.put(`/api/Blogs/${id}`, payload);
    return res.data;
  },

  deleteBlog: async (id: string) => {
    const res = await apiClient.delete(`/api/Blogs/${id}`);
    return res.data;
  },

  getAllUsers: async () => {
    const res = await apiClient.get('/api/users'); // adjust to your endpoint that returns users
    return res.data;
  }
};

export default blogService;