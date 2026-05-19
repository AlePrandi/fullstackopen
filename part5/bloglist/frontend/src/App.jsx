import { useState, useEffect, /*useRef*/ } from 'react'
import { AppBar, Toolbar, Button , Box , Typography } from '@mui/material'
import { useNavigate, Routes, Route, Link, useMatch } from 'react-router-dom'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import Blog from './components/Blog'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState(null)
  const [user, setUser] = useState(null)

  //let blogFormRef = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedUser')
    if (loggedUser) {
      const user = JSON.parse(loggedUser)
      setUser(user)
      blogService.setToken(user.token)
    }
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
    )
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      setUser(user)
      blogService.setToken(user.token)
      navigate('/')
      setUsername('')
      setPassword('')
    } catch {
      setNotification({ text: 'wrong username or password', type: 'error' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const createBlog = async (blogObject) => {
    //blogFormRef.current.toggleVisibility()
    try {
      const newBlog = await blogService.create(blogObject)
      navigate('/')
      setBlogs(blogs.concat(newBlog).sort((a, b) => b.likes - a.likes))

      setNotification({ text: `Note '${newBlog.title}' added!`, type: 'success' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch {
      setNotification({ text: 'Error while creating a blog', type: 'error' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const updateLikes = async (blogObject) => {
    try {
      const newBlog = {
        ...blogObject,
        likes: blogObject.likes +1,
        user: blogObject.user.id
      }
      const updatedBlog = await blogService.update(newBlog.id, newBlog)
      setBlogs(blogs.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog).sort((a, b) => b.likes - a.likes))
    }catch {
      setNotification({ text: 'error while updating blog likes', type: 'error' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const removeBlog = async (blogObject) => {
    try {
      await blogService.remove(blogObject.id)
      setBlogs(blogs.filter(blog => blog.id !== blogObject.id).sort((a, b) => b.likes - a.likes))
      navigate('/')
    }catch {
      setNotification({ text: 'error while deleting a blog', type: 'error' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const match = useMatch('/blogs/:id')
  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null

  return (
    <div>
      <div>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 , mr: 2 }}>
                Blog App
              </Typography>
              <Button color="inherit" component={Link} to="/">blogs</Button>
              <Button color="inherit" component={Link} to="/create">new blog</Button>
              {user ? (
                <>
                  <Button color="inherit" component={Link} to="/"
                    onClick={() => {
                      window.localStorage.removeItem('loggedUser')
                      setUser(null)}}>logout
                  </Button>
                </>
              ): (
                <>
                  <Button color="inherit" component={Link} to="/login">login</Button>
                </>
              )}
            </Toolbar>
          </AppBar>
        </Box>
      </div>

      <Notification notification={notification} />

      <Routes>
        <Route path="/blogs/:id" element={
          <Blog
            blog={blog}
            user={user}
            updateLikes={updateLikes}
            removeBlog={removeBlog}
          />
        }/>
        <Route path="/login" element={
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        } />
        <Route path="/create" element={
          <BlogForm createBlog={createBlog}/>
        } />
        <Route path="/" element={
          <BlogList
            blogs={blogs}
            user={user}
            updateLikes={updateLikes}
            removeBlog={removeBlog}
          />
        } />
      </Routes>
    </div>
  )
}

export default App