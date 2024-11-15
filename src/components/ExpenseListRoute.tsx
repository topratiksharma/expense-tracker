import React, { useState } from "react";
import { Link } from "react-router-dom";
import { client, Expense, ExpenseStatus } from "../util/roger-api-client";

const ExpenseListRoute: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>();

  React.useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const expensesList = await client.listExpenses();
        setExpenses(expensesList);
      } catch (error) {
        console.error("Failed to fetch expenses", error);
      }
    };

    fetchExpenses();
  }, []);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const expense: Expense = {
            id: file.name,
            createdAt: new Date().toLocaleString(),
            vendorName: "Unknown",
            amount: "0",
            status: ExpenseStatus.ANALYZING,
            filename: file.name,
          };
          setExpenses((prevExpenses) => [...(prevExpenses || []), expense]);
          const details = await client.uploadExpense(file);
          setExpenses((prevExpenses) =>
            prevExpenses?.map((exp) =>
              exp.id === file.name
                ? {
                    ...exp,
                    status: details.status,
                    amount: details.amount,
                    id: details.id,
                  }
                : exp
            )
          );
          console.log("Uploaded expense for file", details);

          client.on("expenseAnalyzed", (updatedExpense) => {
            setExpenses((prevExpenses) =>
              prevExpenses?.map((exp) =>
                exp.id === updatedExpense.id
                  ? { ...exp, ...updatedExpense }
                  : exp
              )
            );
          });
        } catch (error) {
          console.error(
            `Failed to upload expense for file: ${file.name}`,
            error
          );
        }
      }
    }
  };

  return (
    <>
      <h1>Expenses</h1>
      <input type="file" multiple onChange={handleFileUpload} />
      <ul>
        {expenses?.map((expense) => (
          <li key={expense.id}>
            <Link to={`/expenses/${expense.id}`}>{expense.filename}</Link>
            <p>Name: {expense.filename}</p>
            <p>Status: {expense.status}</p>
          </li>
        ))}
      </ul>
    </>
  );
};
export default ExpenseListRoute;
