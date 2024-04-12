const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Bloglist app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http:localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Superuser',
        username: 'root',
        password: 'sekret'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = await page.getByText('log in to the application')
    await expect(locator).toBeVisible()

    const usernameInput = await page.getByTestId('username');
    await expect(usernameInput).toBeVisible();
  
    const passwordInput = await page.getByTestId('password');
    await expect(passwordInput).toBeVisible();
  
    const loginButton = await page.getByText('login');
    await expect(loginButton).toBeVisible();
  })
  
})