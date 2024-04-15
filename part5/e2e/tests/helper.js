const { test, expect, beforeEach, describe } = require('@playwright/test')

const loginWith = async (page, username, password)  => {
    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
  }
  
  const createBlog = async (page, title, author, url) => {
    await page.getByRole('button', { name: 'new blog' }).click()
    const textboxes = await page.getByRole('textbox').all()
    await textboxes[0].fill(title)
    await textboxes[1].fill(author)
    await textboxes[2].fill(url)
    await page.getByRole('button', { name: 'Create' }).click()
    const notification = await page.locator('.success')
    await expect(notification).toContainText(`a new blog ${title} by ${author} added`)
    await expect(notification).toHaveCSS('border-style', 'solid')
    await expect(notification).toHaveCSS('color', 'rgb(0, 128, 0)')

  }

  const likeBlog = async (page, title ) => {
    await page.getByTestId(title).click()
    await page.getByRole('button', { name: 'like' }).click()
    await page.getByRole('button', { name: 'hide' }).click()
  }
  
  export { loginWith, createBlog, likeBlog}