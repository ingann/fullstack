import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import loginService from './services/login'
import blogService from './services/blogs'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')   
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [notificationType, setNewType] = useState('')
  const [likeClicked, setLikeClicked] = useState(false)

  const blogFormRef = useRef()

  useEffect(() => {
      const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON)
        setUser(user)
        blogService.setToken(user.token)
      }
  }, [])

  useEffect(() => {
      blogService.getAll().then(initialBlogs => {
        const sortedBlogs = [...initialBlogs].sort((first, second) => second.likes - first.likes)
        setBlogs(sortedBlogs)
   })  
  }, [likeClicked])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setNotification(null)
    }, 5000)
    return() => {clearTimeout(timeout)}
  }, [notification])

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
    const returnedBlog = await blogService.create(blogObject)
        setBlogs(blogs.concat(returnedBlog))
        setNotification(`a new blog ${blogObject.title} by ${blogObject.author} added`)
        setNewType('success')
      } catch (error) {
        setNotification('error')
        setNewType('error')
      }
  }

  const likeBlog = async (blogId, blogObject) => {
    try {
      const updatedBlog = await blogService.update(blogId, blogObject)
      const updatedBlogs = blogs.map(b => (b.id === blogId ? updatedBlog : b))
      setBlogs(updatedBlogs)
      setNotification(`liked a ${blogObject.title}`)
      setNewType('success')
      setLikeClicked(click => !click)
    } catch (error) {
      setNotification('something went wrong')
      setNewType('error')
    }
  }

  const removeBlog = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
        setNotification(`Removed ${blog.title}`)
        setNewType('success')
      } catch (error) {
        setNotification('Failed to remove the blog')
        setNewType('error')
      }
    }
  }

  const handleLogout = ((event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  })

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      setNotification('wrong username or password')
      setNewType('error')
    }
    setUsername('')
    setPassword('')
  }

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  return (
    <div>
      <Notification message={notification} type={notificationType}/>
      {user === null ?
      <LoginForm handleLogin={handleLogin} username={username} password={password} handleUsernameChange={handleUsernameChange} handlePasswordChange={handlePasswordChange}/>
      :
      <div>
        <h2>blogs</h2>
        <p>{user.name} logged-in <button type="submit" onClick={handleLogout}>logout</button></p>
        <Togglable buttonLabel='new blog' ref={blogFormRef}>
          <BlogForm createBlog={addBlog}/>
        </Togglable>
        {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} likeBlog={likeBlog} removeBlog={removeBlog} user={user} />
      )}
      </div>
    }  
    </div>
  )
}

export default App