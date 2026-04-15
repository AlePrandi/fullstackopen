const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  let total = 0
  blogs.forEach(blog => {
    total += blog.likes
  })
  return total
}

const favoriteBlog = (blogs) => {

  let favBlog = null

  if (blogs.length > 0) {
    favBlog = blogs[0]
    blogs.forEach(blog => {
      if (blog.likes > favBlog.likes) {
        favBlog = blog
      }
    })

  }

  return favBlog
}

const mostBlogs = (blogs) => {

  if(!blogs || blogs.length === 0){
    return {
      author: null,
      blogs: 0
    }
  }

  let authors = {}
  let topAuthor = null
  let maxBlog = 0


  blogs.forEach(blog => {
    if(!authors[blog.author]){
      authors[blog.author] = 1
    }else{
      authors[blog.author]++
    }
  })

  for (const author in authors){
    if(authors[author] > maxBlog){
      maxBlog = authors[author]
      topAuthor = author
    }
  }

  return {
    author: topAuthor,
    blogs: maxBlog
  }
}

const mostLikes = (blogs) => {

  if(!blogs || blogs.length === 0){
    return {
      author: null,
      likes: 0
    }
  }

  let authors = {}
  let topAuthor = null
  let mostLikes = 0


  blogs.forEach(blog => {
    if(!authors[blog.author]){
      authors[blog.author] = blog.likes
    }else{
      authors[blog.author] += blog.likes
    }
  })

  for (const author in authors){
    if(authors[author] > mostLikes){
      mostLikes = authors[author]
      topAuthor = author
    }
  }

  return {
    author: topAuthor,
    likes: mostLikes
  }
}


module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }