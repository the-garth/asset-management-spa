/// <reference types="cypress" />

/**
 * Custom Cypress commands for this project.
 * Keep this file minimal — add helpers as needed.
 */

// Example helper: set a fake authenticated user in localStorage
Cypress.Commands.add('seedAuth', (username = 'e2e-user') => {
  window.localStorage.setItem('asset-management-auth', JSON.stringify({ username }))
})

// Export nothing — file exists to satisfy the support import and provide commands
export {}