var _ = require('lodash')

const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogs) => {
    return blogs.length === 0
        ? 0
        : blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0)
        return 0
    const favorite = blogs.reduce((fav, current) => fav.likes > current.likes ? fav : current)

    return {
        title: favorite.title, 
        author: favorite.author, 
        likes: favorite.likes
    }
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0)
        return null

    const blogCounts = _.countBy(blogs, 'author')
    const maxAuthor = _.maxBy(_.keys(blogCounts), author => blogCounts[author])

    return {
        author: maxAuthor,
        blogs: blogCounts[maxAuthor]
    }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0)
        return null

    const blogsByAuthor = _.groupBy(blogs, 'author')
    console.log(blogsByAuthor)
    const maxAuthor = _.maxBy(_.keys(blogsByAuthor), author => _.sumBy(blogsByAuthor[author], 'likes'))
    console.log(maxAuthor)
    const topLikes = _.sumBy(blogsByAuthor[maxAuthor], 'likes')

    return {
        author: maxAuthor,
        likes: topLikes
    }
}

  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }

