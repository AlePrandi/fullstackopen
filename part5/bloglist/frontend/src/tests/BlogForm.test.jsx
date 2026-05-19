import { render, screen } from '@testing-library/react'
import { vi, expect, test } from 'vitest'
import userEvent from '@testing-library/user-event'
import BlogForm from '../components/BlogForm'

test('Blog form test', async () => {

  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog}/>)

  const title = screen.getByLabelText('title')
  const author = screen.getByLabelText('author')
  const url = screen.getByLabelText('url')

  const createButton = screen.getByText('create')

  await user.type(title, 'New Blog')
  await user.type(author, 'Famous author')
  await user.type(url, 'someurl.com')

  await user.click(createButton)

  const submittedData = createBlog.mock.calls[0][0]

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(submittedData.title).toBe('New Blog')
  expect(submittedData.author).toBe('Famous author')
  expect(submittedData.url).toBe('someurl.com')
})