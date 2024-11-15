import {client, ExpenseStatus, Expense} from '../../util/roger-api-client'
import {createDummyExpense} from '../helpers/test-factories'

afterEach(() => {
  client.reset()
})

test('getExpense - success', async () => {
  const expense = await createDummyExpense()

  const expense2 = await client.getExpense(expense.id)
  expect(expense.id).toBe(expense2.id)
})

test('getExpense - with unknown expense', async () => {
  expect(client.getExpense('what')).rejects.toHaveProperty(
    'message',
    `Expense 'what' not found`
  )
})

test('listExpenses', async () => {
  const expense1 = await createDummyExpense('my-expense.pdf')
  const expense2 = await createDummyExpense('other-expense.pdf')

  const expenses = await client.listExpenses()
  expect(expenses).toHaveLength(2)

  // Just check ids, since the objects don't have same identities
  const expenseIds = expenses.map(({id}) => id)
  expect(expenseIds).toContain(expense1.id)
  expect(expenseIds).toContain(expense2.id)
})

test('uploadExpense', async () => {
  // Upload expense
  const expense = await client.uploadExpense(new File([], 'my-expense.pdf'))
  expect(expense.status).toBe(ExpenseStatus.ANALYZING)
  expect(expense.vendorName).toBeNull()
  expect(expense.amount).toBeNull()

  // Wait for expense to be analyzed
  await new Promise<void>((resolve) => {
    const listener = (expense2: Expense) => {
      expect(expense2.id).toBe(expense.id)
      expect(expense2.status).toBe(ExpenseStatus.UNPAID)
      expect(expense2.vendorName).not.toBeNull()
      expect(expense2.amount).not.toBeNull()
      client.off('expenseAnalyzed', listener)
      resolve()
    }
    client.on('expenseAnalyzed', listener)
  })
})

test('patchExpense', async () => {
  // Upload expense
  const expense = await createDummyExpense()

  // Patch it
  const patchedExpense = await client.patchExpense(expense.id, {
    status: ExpenseStatus.PAID,
  })
  expect(patchedExpense.status).toBe(ExpenseStatus.PAID)

  // Get it - to check that it was indeed persisted
  const gottenExpense = await client.getExpense(expense.id)
  expect(gottenExpense).toEqual(patchedExpense)
})

test('deleteExpense', async () => {
  // Upload expense
  const expense = await createDummyExpense()

  // Delete it
  await client.deleteExpense(expense.id)

  // Check that it no longer exists
  expect(await client.listExpenses).toHaveLength(0)
})

test('reset', async () => {
  // Upload a few expenses
  await createDummyExpense('1.pdf')
  await createDummyExpense('2.pdf')
  await createDummyExpense('3.pdf')

  // Reset
  await client.reset()

  // Check that db is empty now
  expect(await client.listExpenses).toHaveLength(0)
})
