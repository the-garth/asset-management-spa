/// <reference types="cypress" />

interface Asset {
  name: string
  // add other properties from the fixture here as needed
}
type Portfolio = {
  positions?: Record<string, unknown>[]
}

describe('Login → Dashboard flow', () => {
  beforeEach(() => {
    // stub API endpoints used by the app to return stable test fixtures and alias them
    cy.intercept('GET', '/mockdata/assets.json', { fixture: 'assets.json' }).as('getAssets')
    cy.intercept('GET', '/mockdata/portfolio.json', { fixture: 'portfolio.json' }).as('getPortfolio')
    cy.intercept('GET', '/mockdata/prices-current.json', { fixture: 'prices-current.json' }).as('getPricesCurrent')
    cy.intercept('GET', '/mockdata/prices-history.json', { fixture: 'prices-history.json' }).as('getPricesHistory')

    // ensure a fresh localStorage for each test
    cy.clearLocalStorage()
  })

  it('can sign in, waits for data to load and shows mocked data, then signs out', () => {
    cy.visit('/login')

    // verify login page rendered
    cy.contains('Sign in').should('be.visible')

    // enter username and submit
    cy.get('input[aria-invalid]').type('cy-user')
    cy.get('button[type="submit"]').click()

    // after sign-in app navigates to /dashboard
    cy.url().should('include', '/dashboard')

    // wait for all data requests to complete (use aliases)
    cy.wait(['@getAssets', '@getPortfolio', '@getPricesCurrent', '@getPricesHistory'])

    // header shows username (component: Header)
    cy.contains(/Signed in as cy-user/i).should('be.visible')

    // summary card should be visible (component: Dashboard)
    cy.contains(/Portfolio Summary/i).should('be.visible')

    // assert specific mocked content appears — use fixtures to drive expectations
    cy.fixture<Asset[]>('assets.json').then((assets) => {
      // assert first asset from fixture is shown in the UI
      if (assets.length) {
        cy.contains(new RegExp(assets[0].name, 'i')).should('be.visible')
      }
    })

    // scope assertions to the Portfolio Summary card to avoid duplicate matches
    cy.contains(/Portfolio Summary/i).closest('div').within(() => {
      cy.contains(/Positions/i).should('be.visible')
      cy.fixture<Portfolio>('portfolio.json').then((portfolio) => {
        const count = portfolio.positions?.length ?? 0
        // check the positions count is visible inside the summary card
        cy.contains(String(count)).should('be.visible')
      })
    })

    // clicking Sign out navigates back to login and clears storage
    cy.contains('Sign out').click()
    cy.url().should('include', '/login')

    // verify localStorage key removed
    cy.window().then((win) => {
      expect(win.localStorage.getItem('asset-management-auth')).to.equal(null)
    })
  })
})