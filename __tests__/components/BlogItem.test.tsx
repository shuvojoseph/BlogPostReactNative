import React from 'react';
import { render } from '@testing-library/react-native';
import BlogItem from '../../src/components/BlogItem';

describe('BlogItem component', () => {
  it('renders blog title and details', () => {
    const blog = { id: '1', title: 'Hello', details: 'World', owners: [] };
    const { getByText } = render(<BlogItem blog={blog} onEdit={() => {}} />);
    expect(getByText('Hello')).toBeTruthy();
    expect(getByText('World')).toBeTruthy();
  });
});
