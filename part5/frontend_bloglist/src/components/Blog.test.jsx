import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'Blog component test',
  author: 'author',
  url: 'https://fullstackopen.com/',
  likes: 0,
  user: {
    username: 'superhero',
    name: 'test user' }
}

test('renders only title and author by default', () => {

  render(<Blog blog={blog} user={blog.user} />)

  const element = screen.getByTestId('default')
  expect(element).toHaveTextContent('Blog component test author')
})

test('Number of likes and blog url are shown when view is clicked', () => {

  const { container } = render(<Blog blog={blog} user={blog.user} />)

  const viewClicked = screen.getByText('view')
  userEvent.click(viewClicked)

  expect(container.querySelector('.blogurl')).toHaveTextContent('https://fullstackopen.com/')
  expect(container.querySelector('.bloglikes')).toHaveTextContent('0 like')
})

test('if like button is clicked twice, event handler is called twice', async () => {

  const mockHandler = vi.fn()
  render(<Blog blog={blog} user={blog.user} likeBlog={mockHandler}/>)
  const user = userEvent.setup()
  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})