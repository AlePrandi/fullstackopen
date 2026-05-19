import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, expect, test, describe } from 'vitest'
import Blog from '../components/Blog'

describe('Blog component tests', () => {
  const blog = {
    author: 'Pippo',
    title: 'Blog example',
    url: 'pippo.it',
    likes: 4,
    user: {
      username: 'creator_user',
      name: 'The Creator'
    }
  }

  test('1. Unauthenticated user: displays info and likes, but NO buttons', () => {
    render(<Blog blog={blog} user={null} />)

    expect(screen.getByText('Pippo: Blog example')).toBeDefined()
    expect(screen.getByText('pippo.it')).toBeDefined()
    expect(screen.getByText('4')).toBeDefined()

    expect(screen.queryByText('like')).toBeNull()
    expect(screen.queryByText('remove')).toBeNull()
  })

  test('2. Authenticated non-creator: shows ONLY like button', () => {

    const loggedUser = { username: 'other_user', name: 'Other User' }

    render(<Blog blog={blog} user={loggedUser} />)

    expect(screen.getByText('like')).toBeDefined()

    expect(screen.queryByText('remove')).toBeNull()
  })

  test('3. Blog creator: shows both like and remove buttons', () => {

    const loggedUser = { username: 'someone', name: 'creator_user' }

    render(<Blog blog={blog} user={loggedUser} />)

    expect(screen.getByText('like')).toBeDefined()
    expect(screen.getByText('remove')).toBeDefined()
  })

  test('4. Like button click calls handler twice', async () => {
    const loggedUser = { username: 'test', name: 'test' }
    const mockHandler = vi.fn()
    const userObj = userEvent.setup()

    render(<Blog blog={blog} user={loggedUser} updateLikes={mockHandler} />)

    const likeButton = screen.getByText('like')
    await userObj.click(likeButton)
    await userObj.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})