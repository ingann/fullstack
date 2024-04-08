import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import loginService from './services/login'
import blogService from './services/blogs'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newTitle, setnewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [username, setUsername] = useState('')   
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [notificationType, setNewType] = useState('')

  useEffect(() => {
    const initializeUser = async () => {
      const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON)
        setUser(user)
        blogService.setToken(user.token)
    }
  }
    initializeUser()
  }, [])

  useEffect(() => {
    const getBlogs = async () => {
      blogService.getAll().then(initialBlogs =>
        setBlogs( initialBlogs )
      )  
    }
    getBlogs()
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setNotification(null)
    }, 5000)
    return() => {clearTimeout(timeout)}
  }, [notification])

  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }
    try {
    const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setNotification(`a new blog ${newTitle} by ${newAuthor} added`)
      setNewType('success')
      setnewTitle('')
      setNewAuthor('')
      setNewUrl('')
    } catch (error) {
      setNotification('error')
      setNewType('error')
    }
  }

  const handleLogout = ((event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  })

  const handleTitleChange = (event) => {
    setnewTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

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
        <BlogForm addBlog={addBlog} user={user} handleLogout={handleLogout} newTitle={newTitle} newAuthor={newAuthor} newUrl={newUrl} handleTitleChange={handleTitleChange}
        handleAuthorChange={handleAuthorChange} handleUrlChange={handleUrlChange}/>
        {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
      </div>
    }  
    </div>
  )
}

export default App