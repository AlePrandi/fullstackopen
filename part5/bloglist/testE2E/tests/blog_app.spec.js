const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Pippo',
        username: 'Pippo',
        password: '123456'
      }
    })

    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Mario',
        username: 'Mario',
        password: 'abcdef'
      }
    })

    await page.waitForTimeout(500)

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await page.goto('http://localhost:5173/login')
    const header = await page.getByRole('heading', { name: 'Login' })
    const username = await page.getByLabel('username')
    const password = await page.getByLabel('password')
    const loginbutton = await page.getByRole('button', { name: /login/ })

    await expect(header).toBeVisible()
    await expect(username).toBeVisible()
    await expect(password).toBeVisible()
    await expect(loginbutton).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'Pippo', '123456')
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.goto('http://localhost:5173/login')
      await page.getByLabel('username').fill('Pippo')
      await page.getByLabel('password').fill('wrong')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'Pippo', '123456')

    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'first blog', 'Pippo', 'pippo.it')
      await expect(page.getByRole('link', { name: 'first blog' })).toBeVisible()    
    })

    test('a logged-in user can like a blog', async ({ page }) => {
      await createBlog(page, 'first blog', 'Pippo', 'pippo.it')
      await page.getByRole('link', { name: 'first blog' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.locator('span').filter({ hasText: '1' })).toBeVisible()
    })

    test('a logged-in user can delete their own blog', async ({ page }) => {
      await createBlog(page, 'first blog', 'Pippo', 'pippo.it')
      await page.getByRole('link', { name: 'first blog' }).click()
      page.on('dialog', async (dialog) => {
        expect(dialog.type()).toContain('confirm')
        await dialog.accept()
      })
      await page.getByRole('button', { name: 'remove' }).click()
      await page.waitForURL('http://localhost:5173/')
      await expect(page.getByRole('link', { name: 'first blog' })).not.toBeVisible()
    })

    test('a user cannot delete a blog they did not create', async ({ page }) => {
      await createBlog(page, 'first blog', 'Pippo', 'pippo.it')
      await page.getByRole('button', { name: 'logout' }).click()
      await loginWith(page, 'Mario', 'abcdef')
      await page.getByRole('link', { name: 'first blog' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })
  })
})