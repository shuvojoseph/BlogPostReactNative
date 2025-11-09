import blogService from '../../src/api/blogService';
import apiClient from '../../src/api/apiClient';

jest.mock('../../src/api/apiClient');

describe('blogService', () => {
  it('fetches all blogs', async () => {
    (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: [{ id: 1, title: 'Test Blog' }] });
    const blogs = await blogService.getBlogs();
    expect(apiClient.get).toHaveBeenCalledWith('/api/blogs');
    expect(blogs[0].title).toBe('Test Blog');
  });

  it('adds a new blog', async () => {
    const payload = { title: 'New Blog', details: 'Details', coOwnerIds: [] };
    (apiClient.post as jest.Mock).mockResolvedValueOnce({ data: { id: 2, ...payload } });
    const blog = await blogService.addBlog(payload);
    expect(apiClient.post).toHaveBeenCalledWith('/api/blogs', payload);
    expect(blog.title).toBe('New Blog');
  });
});

