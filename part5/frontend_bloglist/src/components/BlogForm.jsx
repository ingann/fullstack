const BlogForm = ({addBlog, user, handleLogout, newTitle, newAuthor, newUrl, handleTitleChange, handleAuthorChange, handleUrlChange}) => {
    return (
        <div>
        <h2>blogs</h2>
        <p>{user.name} logged-in <button type="submit" onClick={handleLogout}>logout</button></p>
    <form onSubmit={addBlog}>
      <h2>create new</h2>
        <div>title:<input value={newTitle} onChange={handleTitleChange} /></div>
        <div>author:<input value={newAuthor} onChange={handleAuthorChange}/></div>
        <div>url:<input value={newUrl} onChange={handleUrlChange} /></div>
      <button type="submit">Create</button>
    </form>
    </div>
    )
}

export default BlogForm