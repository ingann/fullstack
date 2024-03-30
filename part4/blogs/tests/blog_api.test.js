const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const helper = require('./test_helper')
const api = supertest(app)
const Blog = require('../models/blog')


beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})


test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    console.log(response.body)
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')
  
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('blog identifier is named as id instead of _id', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body

    const validIds = blogs.map(blog => {
        assert.ok(blog.id)
        assert.strictEqual(blog._id, undefined)
    })
  })
  
  test('a valid blog can be added ', async () => {
    const newBlog = {
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0
      }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
  
    const createdBlog = blogsAtEnd.find(b => b.title === newBlog.title)
    assert.deepStrictEqual(createdBlog, {...newBlog, id: createdBlog.id})
  })

after(async () => {
  await mongoose.connection.close()
})