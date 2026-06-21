import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import HomeDemo from '@/components/homepage/HomeDemo'

vi.useFakeTimers();

describe('HomeDemo', () => {
  it('sends a message and shows it in the receiver list', async () => {
    render(<HomeDemo />)

    const textarea = screen.getByLabelText(/Type an anonymous message/i)
    const button = screen.getByRole('button', { name: /send anonymously/i })

    fireEvent.change(textarea, { target: { value: 'Hello test' } })
    expect(textarea).toHaveValue('Hello test')

    await act(async () => {
      fireEvent.click(button)
      // advance timers to trigger fly and receive
      vi.advanceTimersByTime(1000)
    })

    // new message should appear in the receiver area
    expect(screen.getByText('Hello test')).toBeInTheDocument()
  })
})
