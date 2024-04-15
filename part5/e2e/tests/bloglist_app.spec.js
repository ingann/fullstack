const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Bloglist app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Superuser',
        username: 'root',
        password: 'sekret'
      }
    })

    await page.goto('')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = await page.getByText('log in to the application')
    await expect(locator).toBeVisible()
    await expect(page.getByTestId('username')).toBeVisible();
    await expect(page.getByTestId('password')).toBeVisible();
    await expect(page.getByText('login')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'root', 'sekret')
      await expect(page.getByText('Superuser logged-in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'root', 'wrong')

      const notification = await page.locator('.error')
      await expect(notification).toContainText('wrong username or password')
      await expect(notification).toHaveCSS('border-style', 'solid')
      await expect(notification).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(page.getByText('Superuser logged-in')).not.toBeVisible()
    }) 
  })
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'root', 'sekret')
    })
  
    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'a blog created by playwright', 'author', 'url')
      await expect(page.getByTestId('defaultview')).toBeVisible()
    })
    test('a blog can be edited', async ({ page }) => {
      await createBlog(page, 'a blog created by playwright', 'author', 'url')
      await page.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('1 like')).toBeVisible()
    })
  })
  describe('Deletion of a blog', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'root', 'sekret')
      await createBlog(page, 'a blog created by playwright', 'author', 'url')
    })
  
    test('user who added the blog can remove the blog', async({ page }) => {
      page.on('dialog', async dialog => {
        expect(dialog.message()).toContain('Remove blog')
        await dialog.accept()
      })
      await page.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByTestId('clicked')).not.toBeVisible()
    })
  })
})