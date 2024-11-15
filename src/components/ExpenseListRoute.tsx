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
      <div className="container mt-4">
        <h1 className="mb-4">Expenses</h1>
        <div className="mb-3">
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Search expenses"
            className="form-control"           
          />
        </div>
        <div
          className="list-group"
          style={{ maxHeight: "800px", overflowY: "auto" }}
        >
          {expenses?.map((expense) => (
            <Link
              key={expense.id}
              to={`/expenses/${expense.id}`}
              className="list-group-item text-decoration-none"
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1">{expense.filename}</h5>
                  <p className="mb-1">Status: {expense.status}</p>
                </div>
                <span className="badge bg-primary rounded-pill">
                  {expense.amount}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};
export default ExpenseListRoute;
