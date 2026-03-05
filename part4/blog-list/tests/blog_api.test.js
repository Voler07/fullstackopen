const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const api = supertest(app)

const initialBlogs = [
  {
    title: 'xxx',
    author: 'A',
    url: '',
    likes: 10,
  },
  {
    title: 'yyy',
    author: 'B',
    url: '',
    likes: 20,
  },
  {
    title: 'zzz',
    author: 'C',
    url: '',
    likes: 30,
  },  
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject1 = new Blog(initialBlogs[0])
  await blogObject1.save()
  let blogObject2 = new Blog(initialBlogs[1])
  await blogObject2.save()
  let blogObject3 = new Blog(initialBlogs[2])
  await blogObject3.save()
})

test('blog lists are returned as json', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, initialBlogs.length)
})

test.only('unique identifier property of the blog posts is named id', async () => {
 const response = await api.get('/api/blogs')
 assert.ok(response.body[0].id)
})

test('a valid note can be added ', async () => {
  const newBlog = { 
    title: 'async/await simplifies making async calls',
    author: 'xxx',
    url: '',
    likes: 999,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const titles = response.body.map(r => r.title)

  assert.strictEqual(response.body.length, initialBlogs.length + 1)

  assert(titles.includes('async/await simplifies making async calls'))
})

after(async () => {
  await mongoose.connection.close()
})