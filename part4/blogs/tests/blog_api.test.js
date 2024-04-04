const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const helper = require('./test_helper')
const api = supertest(app)
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const User = require('../models/user')

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
    let token = ''
    let userId = ''
    beforeEach(async () => {
        await User.deleteMany({})
        const newUser = {
            username: "apitesting",
            password: "secret"
        }
        const userResponse = await api.post('/api/users').send(newUser)
        userId = userResponse.body.id
        const loginResponse = await api
          .post('/api/login')
          .send({ username: newUser.username, password: newUser.password })
      
        token = loginResponse.body.token
    })
    
    test('a valid blog can be added with token', async () => {
        const newBlog = {
          title: "TDD harms architecture",
          author: "Robert C. Martin",
          url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
          likes: 0
        }
      
        await api
          .post('/api/blogs')
          .set('Authorization', `Bearer ${token}`)
          .send(newBlog)
          .expect(201)
          .expect('Content-Type', /application\/json/)
      
        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
      
        const createdBlog = blogsAtEnd.find(b => b.title === newBlog.title)
        assert.deepStrictEqual(createdBlog.user.toString(), userId)
        assert.deepStrictEqual(createdBlog.title, newBlog.title)
      })

  test('likes property defaults to 0 if missing', async () => {

    const newBlog = {
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html"
      }
    
    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
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
      .set('Authorization', `Bearer ${token}`)
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
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
})

describe('deletion of a blog', () => {
    let token = ''
    let userId = ''
    let blogToDelete = null

    beforeEach(async () => {
        await User.deleteMany({})
        await Blog.deleteMany({})

        const newUser = {
            username: "apitesting",
            password: "secret"
        }
        const userResponse = await api.post('/api/users').send(newUser)
        userId = userResponse.body.id

        const loginResponse = await api
            .post('/api/login')
            .send({ username: newUser.username, password: newUser.password })

        token = loginResponse.body.token

        const newBlog = {
            title: "Test Blog",
            author: "Test Author",
            url: "http://example.com",
            likes: 0
        }

        const createBlogResponse = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)

        blogToDelete = createBlogResponse.body
    })

    test('succeeds with status code 204 if id is valid and user is authorized', async () => {

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)

            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, 0)
    
            const titles = blogsAtEnd.map(r => r.title)
            assert(!titles.includes(blogToDelete.title))
    })

    test('fails with status code 403 if user is not authorized to delete the blog', async () => {
        const anotherUser = {
            username: "anotheruser",
            password: "password"
        }
        await api.post('/api/users').send(anotherUser)

        const anotherUserLoginResponse = await api
            .post('/api/login')
            .send({ username: anotherUser.username, password: anotherUser.password })

        const anotherUserToken = anotherUserLoginResponse.body.token

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${anotherUserToken}`)
            .expect(403)
    })
})

  describe('updating a blog', () => {
    test('updating likes of a blog post', async() => {
    const blogsAtStart = await helper.blogsInDb()
    console.log(blogsAtStart)
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {...blogToUpdate, likes: blogToUpdate.likes + 1}

    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlogInDb = blogsAtEnd.find(b => b.id === blogToUpdate.id)
    assert.strictEqual(updatedBlogInDb.likes, blogToUpdate.likes + 1)
    })
  })

  describe('when there is initially one user at db', () => {
    beforeEach(async () => {
      await User.deleteMany({})
  
      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'matti', passwordHash })
  
      await user.save()
    })
  
    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
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
  
    test('creation fails with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await helper.usersInDb()
      
      const newUser = {
        username: 'matti',
        name: 'Superuser',
        password: 'salainen',
      }
  
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
  
      assert(result.body.error.includes('expected `username` to be unique'))
  
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if password is too short', async () => {

        const usersAtStart = await helper.usersInDb()
      const newUser = {
        username: 'testperson',
        name: 'Superuser',
        password: '',
      }
  
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
  
      assert(result.body.error.includes('Password and username must be at least three characters long'))
  
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if username is too short', async () => {

        const usersAtStart = await helper.usersInDb()
      const newUser = {
        username: '',
        name: 'Superuser',
        password: 'secret',
      }
  
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
      console.log(result.body.error)
  
      const errorMessage = result.body.error
      const expectedError = newUser.username ? 'is shorter than the minimum allowed length' : 'Path `username` is required'
      
      assert(errorMessage.includes(expectedError))
  
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if username and password are too short', async () => {

        const usersAtStart = await helper.usersInDb()
      const newUser = {
        username: 'te',
        name: 'Superuser',
        password: 'se',
      }
  
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
      console.log(usersAtEnd)
  
      console.log(result.body.error)
      assert(result.body.error.includes('Password and username must be at least three characters long'))
  
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
  })

after(async () => {
  await mongoose.connection.close()
})
