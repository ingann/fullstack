const { test, after, beforeEach, describe } = require('node:test')
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

describe('when there are initially some blogs saved', () => {
test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')
  
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })
})

describe ('blog obejct has correct namings', () => {
  test('blog identifier is named as id instead of _id', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body

    const validIds = blogs.map(blog => {
        assert.ok(blog.id)
        assert.strictEqual(blog._id, undefined)
    })
  })
})
  
describe('addition of a new blog', () => {
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

  test('likes property defaults to 0 if missing', async () => {

    const newBlog = {
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html"
      }
    
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const res = await api.get('/api/blogs')
        const blogs = res.body

        const createdBlog = blogs.find(blog => blog.title === newBlog.title)

        assert.strictEqual(createdBlog.likes, 0)
  })

  test('blog without url is not added', async () => {
    const newBlog = {
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        likes: 0
      }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('blog without title is not added', async () => {
    const newBlog = {
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
      }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
})

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)
        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

        const titles = blogsAtEnd.map(r => r.title)
        assert(!titles.includes(blogToDelete.title))
    })
  })

after(async () => {
  await mongoose.connection.close()
})