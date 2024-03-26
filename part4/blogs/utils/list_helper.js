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

  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
  }

