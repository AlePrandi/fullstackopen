import { useState } from 'react'
import { TextField, Button } from '@mui/material'


const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url,
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          <TextField
            label='title'
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            style={{ marginTop: 5, marginBottom: 5 }}
          />
        </div>
        <div>
          <TextField
            label='author'
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            style={{ marginTop: 5, marginBottom: 5 }}
          />
        </div>
        <div>
          <TextField
            label='url'
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            style={{ marginTop: 5, marginBottom: 5 }}
          />
        </div>
        <Button type="submit" variant="contained" style={{ marginTop : 10 }}>create</Button>
      </form>
    </div>
  )
}

export default BlogForm