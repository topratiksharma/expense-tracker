import {client, Expense} from '../../util/roger-api-client'

export async function createDummyExpense(filename = 'my-expense.pdf') {
  // Upload expense
  let expense = await client.uploadExpense(new File([], filename))
  // Wait for expense to have been analyzed - just so it doesn't change later
  await new Promise<void>((resolve) => {
    const listener = (expense2: Expense) => {
      if (expense2.id === expense.id) {
        expense = expense2
        client.off('expenseAnalyzed', listener)
        resolve()
      }
    }
    client.on('expenseAnalyzed', listener)
  })
  return expense
}
