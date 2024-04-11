import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders only title and author by default', () => {
  const blog = {
    title: 'Blog component test',
    author: 'test person',
    url: 'https://fullstackopen.com/',
    likes: 0,
    user: {
      username: 'superhero',
      name: 'test user' }
  }

  render(<Blog blog={blog} user={blog.user} />)

  screen.debug()
  const element = screen.getByTestId('default')
  expect(element).toHaveTextContent('Blog component test test person')
})