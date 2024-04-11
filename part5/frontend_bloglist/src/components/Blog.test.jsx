import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'Blog component test',
  author: 'test person',
  url: 'https://fullstackopen.com/',
  likes: 0,
  user: {
    username: 'superhero',
    name: 'test user' }
}

test('renders only title and author by default', () => {

  render(<Blog blog={blog} user={blog.user} />)

  const element = screen.getByTestId('default')
  expect(element).toHaveTextContent('Blog component test test person')
})

test('Number of likes and blog url are shown when view is clicked', () => {

  const { container } = render(<Blog blog={blog} user={blog.user} />)

  const viewClicked = screen.getByText('view')
  userEvent.click(viewClicked)

  expect(container.querySelector('.blogurl')).toHaveTextContent('https://fullstackopen.com/')
  expect(container.querySelector('.bloglikes')).toHaveTextContent('0 like')
})
