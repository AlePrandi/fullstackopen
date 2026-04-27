const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const helper = require('./test_helper')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const app = require('../app')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()
})

describe('Test for creating users', () => {
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Marc06',
      name: 'Marco Rossi',
      password: 'complicatedPassword',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('Test fail if username is already present', async () => {
    const usersAtStart = await helper.usersInDb()

    const presentUser = {
      username: 'root',
      name: 'Mario Verdi',
      password: 'simplePassword',
    }

    await api
      .post('/api/users')
      .send(presentUser)
      .expect(400)
      .expect({ error: 'expected `username` to be unique' })

    // FIX: era helper.UserInDb() con la U maiuscola
    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('Test fail if username shorter than 3 chars', async () => {
    const usersAtStart = await helper.usersInDb()

    const wrongUser = {
      username: 'Ab',
      name: 'Mario Verdi',
      password: 'simplePassword',
    }

    await api
      .post('/api/users')
      .send(wrongUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('Test fail if password is shorter than 3 chars', async () => {
    const usersAtStart = await helper.usersInDb()

    const wrongUser = {
      username: 'Marc06',
      name: 'Mario Verdi',
      password: '23',
    }

    await api
      .post('/api/users')
      .send(wrongUser)
      .expect(400)
      .expect({ error: 'password should be at least 3 characters' })

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})