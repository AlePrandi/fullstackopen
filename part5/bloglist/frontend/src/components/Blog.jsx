import { useState } from 'react'

const Blog = ({ blog, user, updateLikes, removeBlog }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  if(!visible){
    return (
      <div style={blogStyle}>
        <div>
          {blog.title} {blog.author} <button onClick={() => setVisible(true)}>view</button>
        </div>
      </div>
    )
  }else{
    if(blog.user.username === user){
      return (
        <div style={blogStyle}>
          <div>
            {blog.title} {blog.author} <button onClick={() => setVisible(false)}>hide</button> <br></br>
            {blog.url} <br></br>
            {blog.likes} <button onClick={() => updateLikes(blog)}>like</button> <br></br>
            {blog.user.username} <br></br>
            <button onClick={() => {
              if(window.confirm(`Delete ${blog.title} by ${blog.author} ?`)){
                removeBlog(blog)
              }
            }}>remove</button>
          </div>
        </div>
      )
    }else{
      return (
        <div style={blogStyle}>
          <div>
            {blog.title} {blog.author} <button onClick={() => setVisible(false)}>hide</button> <br></br>
            {blog.url} <br></br>
            {blog.likes} <button onClick={() => updateLikes(blog)}>like</button> <br></br>
            {blog.user.username} <br></br>
          </div>
        </div>
      )
    }
  }
}

export default Blog