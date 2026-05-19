const loginWith = async (page, username, password) => {
  await page.goto('http://localhost:5173/login')
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
  await page.waitForURL('http://localhost:5173/')
}

const createBlog = async (page, title, author, url) => {
  await page.goto('http://localhost:5173/create')
  await page.getByLabel('title').fill(title)
  await page.getByLabel('author').fill(author)
  await page.getByLabel('url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  await page.waitForURL('http://localhost:5173/')
  await page.getByRole('link', { name: title }).waitFor({ state: 'visible' })
}

export { loginWith, createBlog }