import { useState, useEffect } from 'react';
import blogService from '../api/blogService';
import { BlogPayload } from '../models/blog';

export const useBlogViewModel = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await blogService.getBlogs();
      setBlogs(data);
    } catch (e: any) {
      setError(e.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const addBlog = async (payload: BlogPayload) => {
    const res = await blogService.addBlog(payload);
    await fetchBlogs();
    return res;
  };

  const updateBlog = async (id: string, payload: BlogPayload) => {
    const res = await blogService.updateBlog(id, payload);
    await fetchBlogs();
    return res;
  };

  const deleteBlog = async (id: string) => {
    const res = await blogService.deleteBlog(id);
    await fetchBlogs();
    return res;
  };

  const getAllUsers = async () => {
    return blogService.getAllUsers();
  };

  return { blogs, loading, error, fetchBlogs, addBlog, updateBlog, deleteBlog, getAllUsers };
};
