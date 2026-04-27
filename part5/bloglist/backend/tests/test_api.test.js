const { test, describe, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const bcrypt = require('bcrypt')

const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

let token = null

beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('root', 10)
  const user = new User({
    username: 'root',
    name: 'root',
    passwordHash
  })
  await user.save()

  const login = await api
    .post('/api/login')
    .send({ username: 'root', password: 'root' })

  token = login.body.token

  const users = await helper.usersInDb()
  const root = users.find(u => u.username === 'root')

  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog({ ...blog, user: root.id })
    await blogObject.save()
  }
})

describe('GET /api/blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('blogs length matches initial data', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('id field is correctly named', async () => {
    const response = await api.get('/api/blogs')
    const blog = response.body[0]

    assert.ok(blog.id)
    assert.strictEqual(blog._id, undefined)
  })

  test('non existing id returns 404', async () => {
    const id = await helper.nonExistingBlogId()
    await api.get(`/api/blogs/${id}`).expect(404)
  })

  test('invalid id returns 400', async () => {
    await api.get('/api/blogs/invalid123').expect(400)
  })
})

describe('POST /api/blogs', () => {
  test('fails with 401 if token missing', async () => {
    const newBlog = {
      title: 'Test',
      author: 'Ale',
      url: 'http://test.com',
      likes: 1
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })

  test('successfully adds a blog', async () => {
    const newBlog = {
      title: 'The doc',
      author: 'Valentino Rossi',
      url: 'http://Vale.rossi.it',
      likes: 5,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
  })

  test('missing likes defaults to 0', async () => {
    const newBlog = {
      title: 'Pucciotti',
      author: 'Marc',
      url: 'http://Marco_rossi.it',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    const response = await api.get('/api/blogs')
    const saved = response.body.find(b => b.title === newBlog.title)

    assert.strictEqual(saved.likes, 0)
  })

  test('missing title or url returns 400', async () => {
    const invalidBlog = {
      author: 'Marc',
      likes: 5,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(invalidBlog)
      .expect(400)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })
})

describe('DELETE /api/blogs/:id', () => {
  test('successfully deletes a blog', async () => {
    const blogs = await api.get('/api/blogs')
    const id = blogs.body[0].id

    await api
      .delete(`/api/blogs/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const after = await api.get('/api/blogs')
    assert.strictEqual(after.body.length, blogs.body.length - 1)
  })
})

describe('PUT /api/blogs/:id', () => {
  test('successfully updates a blog', async () => {
    const blogs = await api.get('/api/blogs')
    const blog = blogs.body[0]

    const updated = { ...blog, likes: 95 }

    await api
      .put(`/api/blogs/${blog.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updated)
      .expect(200)

    const after = await api.get('/api/blogs')
    const updatedBlog = after.body.find(b => b.id === blog.id)
    assert.strictEqual(updatedBlog.likes, 95)
  })

  test('updating non-existing id returns 404', async () => {
    const blogs = await api.get('/api/blogs')
    const id = await helper.nonExistingBlogId()

    await api
      .put(`/api/blogs/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(blogs.body[0])
      .expect(404)

    const after = await api.get('/api/blogs')
    assert.strictEqual(after.body.length, blogs.body.length)
  })
})


after(async () => {
  await mongoose.connection.close()
})