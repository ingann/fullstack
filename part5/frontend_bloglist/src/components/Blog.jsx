import {useState} from 'react'

const Blog = ({ blog, likeBlog}) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
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
    </div>
  </div>
)}

export default Blog