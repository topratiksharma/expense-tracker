import React from 'react'
import {render, fireEvent, waitFor} from '@testing-library/react'
import {SettingsRoute} from '../../components/SettingsRoute'
import {client} from '../../util/roger-api-client'

afterEach(() => {
  client.reset()
})

test('clicking reset button', async () => {
  // Add some expenses
  await client.uploadExpense(new File([], '1.pdf'))
  await client.uploadExpense(new File([], '2.pdf'))

  // Render route
  const {getByText} = render(<SettingsRoute />)

  // Click delete button
  fireEvent.click(getByText('Delete all expenses'))

  // Wait for success message to be displayed
  await waitFor(() => getByText('All expenses were deleted.'))

  // Check that db is empty now
  expect(await client.listExpenses()).toHaveLength(0)
})
