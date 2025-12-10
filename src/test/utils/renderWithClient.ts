import React from 'react'
import { render } from '@testing-library/react'
import type { RenderResult } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: 
      { 
        retry: false, 
        staleTime: Infinity, // optional: avoid refetches during assertions
      }
    },
  })
}

export function renderWithClient(ui: React.ReactElement): RenderResult {
  const client = createTestQueryClient()
  return render(React.createElement(QueryClientProvider, { client }, ui))
}