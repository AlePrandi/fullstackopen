const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.send(blogs)
})

blogRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 })
  if(!blog){
    return response.status(404).end()
  }
  response.send(blog)
})

blogRouter.put('/:id', async (request, response) => {
  if(!request.user){
    return response.status(401).json({ error: 'token invalid' })
  }

  //const user = request.user
  let blog = await Blog.findById(request.params.id)
  if(!blog){
    return response.status(404).end()
  }

  /*
  if(blog.user.toString() === user.id.toString()){
    const likes = request.body.likes
    blog.likes = likes
    const savedBlog = await blog.save(blog)
    const populatedBlog = await savedBlog.populate('user', {
      username: 1,
      name: 1
    })

    response.json(populatedBlog)
  }else{
    response.status(403).json({ error: 'this user cannot modify this note' })
  }
  */
  const likes = request.body.likes
  blog.likes = likes
  const savedBlog = await blog.save(blog)
  const populatedBlog = await savedBlog.populate('user', {
    username: 1,
    name: 1
  })

  response.json(populatedBlog)
})

blogRouter.post('/', async (request, response) => {

  if(!request.user){
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = request.user
  const blog = new Blog({
    ...request.body,
    user: user.id,
  })

  if(!user){
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  if(!blog.title || !blog.url){
    return response.status(400).end()
  }

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  const populatedBlog = await savedBlog.populate('user', {
    username: 1,
    name: 1
  })
  await user.save()

  response.status(201).json(populatedBlog)
})

blogRouter.delete('/:id', async (request, response) => {

  if(!request.user){
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if(blog.user.toString() === user.id.toString()){
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  }else{
    return response.status(401).json({ error: 'This user cannot delete the blog' })
  }

})

module.exports = blogRouter