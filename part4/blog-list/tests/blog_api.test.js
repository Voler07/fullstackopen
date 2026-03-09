const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const blog = require('../models/blog')
const api = supertest(app)

const initialBlogs = [
  {
    title: 'xxx',
    author: 'A',
    url: 'aaa',
    likes: 10,
  },
  {
    title: 'yyy',
    author: 'B',
    url: 'bbb',
    likes: 20,
  },
  {
    title: 'zzz',
    author: 'C',
    url: 'ccc',
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
    .get('/api/blogs/')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('unique identifier property of the blog posts is named id', async () => {
 const response = await api.get('/api/blogs')
 assert.ok(response.body[0].id)
})

test('a valid blog can be added ', async () => {
  const newBlog = { 
    title: 'async/await simplifies making async calls',
    author: 'xxx',
    url: 'iii',
    likes: 999,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs/')

  assert.strictEqual(response.body.length, initialBlogs.length + 1)

})

test('If the likes property is missing from the request, it will default to the value 0.', async () => {
  const newBlog = { 
    title: 'async/await simplifies making async calls',
    author: 'xxx',
    url: 'kkk',
  }
  
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs/')
  blogSaved = response.body.find(blog => blog.title === newBlog.title)
  assert.strictEqual(blogSaved.likes, 0)
})

test.only('if the title or url properties are missing from the request data, the backend responds to the request with the status code 400 Bad Request.', async () => {
  const newBlog = { 
    title: 'async/await simplifies making async calls',
    author: 'xxx',
    likes: 999,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('a blog can be deleted', async() => {
  const blogsAtStart = await Blog.find({})
  const blogToDelete = blogsAtStart[0]

  const response = await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await api.get('/api/blogs/')

  assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length - 1)

  const contents = blogsAtEnd.body.map(r => r.title)

  assert(!contents.includes(blogToDelete.title))
})

test('a blog can be updated', async () => {
  const blogsAtStart = await Blog.find({})
  const blogToUpdate = blogsAtStart[0]

  const updatedBlogData = {
    likes: blogToUpdate.likes + 1, 
  }
  
  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlogData)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await Blog.find({})
  const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)

  assert.strictEqual(updatedBlog.likes, blogToUpdate.likes + 1)
})


after(async () => {
  await mongoose.connection.close()
})