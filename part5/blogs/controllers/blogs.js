const blogsRouter = require('express').Router()
const { request } = require('../app')
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
      .find({}).populate('user', { username: 1, name: 1, })
    response.json(blogs)
  })

  blogsRouter.post('/', middleware.userExtractor, async (request, response, next) => {
    const body = request.body
    const user = request.user
    const token = request.token

  if (!(token && user.id)) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes !== undefined ? body.likes: 0,
      user: user.id
    })
  
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  })

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const token = request.token
  const user = request.user

  if (!(token && user.id)) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  const blog = await Blog.findById(request.params.id)
  if (blog.user.toString() !== user.id.toString()) {
    return response.status(403).json({ error: 'not authorized to delete this blog' });
  }
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
  })

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: body.user
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true}).populate('user')
  response.json(updatedBlog)
})

module.exports = blogsRouter