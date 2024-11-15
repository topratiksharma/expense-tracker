import React from 'react'
import {render} from '@testing-library/react'
import {ExpenseListRoute} from '../../components/ExpenseListRoute'

// TODO: Add tests? Take inspiration from SettingsRoute.test.tsx maybe.

test('renders without crashing', () => {
  const {getByText} = render(<ExpenseListRoute />)

  // Check that title is rendered
  expect(getByText('Expenses')).toBeInTheDocument()
})
