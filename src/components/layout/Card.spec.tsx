import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Card } from './Card'

describe('Card', () => {
  it('renders children and applies default classes and inline styles', () => {
    render(<Card>Hello Card</Card>)
    const el = screen.getByText('Hello Card').closest('div') as HTMLElement
    expect(el).toBeTruthy()
    // default utility classes are present
    expect(el.className).toMatch(/rounded-lg/)
    expect(el.className).toMatch(/shadow-sm/)
    expect(el.className).toMatch(/p-6/)

    // inline styles use design tokens
    expect(el.style.backgroundColor).toBe('var(--color-card-bg)')
    expect(el.style.border).toBe('1px solid var(--color-border)')
    expect(el.style.color).toBe('var(--color-text)')
  })

  it('merges additional className passed via props', () => {
    render(<Card className="custom-class">Content</Card>)
    const el = screen.getByText('Content').closest('div') as HTMLElement
    expect(el).toBeTruthy()
    expect(el.className).toContain('custom-class')
  })
})