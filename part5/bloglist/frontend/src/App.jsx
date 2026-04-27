import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)

  let blogFormRef = useRef()

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedUser')
    if (loggedUser) {
      const user = JSON.parse(loggedUser)
      setUser(user)
      blogService.setToken(user.token)
      blogService.getAll().then(blogs =>
        setBlogs(blogs.sort((a, b) => b.likes - a.likes))
      )
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      setUser(user)
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
    } catch {
      setError('wrong username or password')
      setTimeout(() => {
        setError(null)
      }, 3000)
    }
  }

  const createBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog).sort((a, b) => b.likes - a.likes))
      setMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch {
      setError('error while creating a new blog')
      setTimeout(() => {
        setError(null)
      }, 3000)
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
      setError('error while updating blog likes')
    }
  }

  const removeBlog = async (blogObject) => {
    try {
      await blogService.remove(blogObject.id)
      setBlogs(blogs.filter(blog => blog.id !== blogObject.id).sort((a, b) => b.likes - a.likes))
    }catch {
      setError('error while deleting a blog')
      setTimeout(() => {
        setError(null)
      }, 3000)
    }
  }

  const loginForm = () => {
    return (
      <div>
        <Notification message={error} type="error"/>
        <LoginForm 
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </div>
    )
  }

  const blogForm = () => {
    return (
      <div>
        <BlogForm createBlog={createBlog}/>
      </div>
    )
  }

  const blog = () => {
    return (
      <div>
        {blogs.map(blog =>
          <Blog 
          key={blog.id} 
          blog={blog} 
          user={user.name} 
          updateLikes={updateLikes} 
          removeBlog={removeBlog}
          />
        )}
      </div>
    )
  }

  return (
    <div>
      {!user && loginForm()}
      {user && (
        <div>
          <h1>blogs</h1>
          <p>{user.name} logged in <button
            onClick={() => { 
              window.localStorage.removeItem('loggedUser') 
              setUser(null)}}>logout
          </button></p>
          <Notification message={message} type="message"/>
          <Togglable buttonLabel="create blog" ref={blogFormRef}>
            {blogForm()}
          </Togglable>
          {blog()}
        </div>)}
    </div>
  )
}

export default App