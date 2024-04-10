import { useState, useEffect } from 'react'

const Blog = ({ blog, likeBlog, removeBlog, user }) => {
  const [visible, setVisible] = useState(false)
  const [authorizedUser, setAuthorizedUser] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }
  const showWhenAuthorized = { display: authorizedUser ? '': 'none' }

  useEffect(() => {
    const authUser = blog.user.username === user.username
    setAuthorizedUser(authUser)
  }, [blog, user])

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLikes = (event) => {
    event.preventDefault()
    likeBlog (blog.id, {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id
    })
  }

  const handleRemove = (event) => {
    event.preventDefault()
    removeBlog(blog)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>hide</button>
        <div>{blog.url}</div>
        <div>{blog.likes} <button onClick={handleLikes}>like</button></div>
        <div>{blog.user.name}</div>
        <div style={showWhenAuthorized}><button onClick={handleRemove}>remove</button></div>
      </div>
    </div>
  )}

export default Blog