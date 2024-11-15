import React from 'react'
import {render} from '@testing-library/react'
import {App} from '../../components/App'

test('renders without crashing', () => {
  const {getByText} = render(<App />)

  // Check that menu items are there
  expect(getByText('Expenses')).toBeInTheDocument()
  expect(getByText('Settings')).toBeInTheDocument()
})
