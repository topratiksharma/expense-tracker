import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { client, Expense, ExpenseStatus } from "../util/roger-api-client";

const ExpenseDetailsRoute: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [expense, setExpense] = useState<Expense | null>(null);

  useEffect(() => {
    const fetchExpense = async () => {
      const expenseDetails = await client.getExpense(id);
      setExpense(expenseDetails);
    };
    fetchExpense();
  }, [id]);

  if (!expense) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Expense Detail</h2>
      <p>
        <strong>Name:</strong> {expense.filename}
      </p>
      <p>
        <strong>Amount:</strong> ${expense.amount}
      </p>
      <p>
        <strong>Vendor:</strong> {expense.status}
      </p>
      <p>
        <strong>Vendor:</strong> {expense.vendorName}
      </p>
      <p>
        <strong>Date:</strong> {expense.createdAt}
      </p>
      <button
        onClick={async () => {
          await client.patchExpense(id, { status: ExpenseStatus.PAID });
          setExpense({ ...expense, status: ExpenseStatus.PAID });
        }}
      >
        Pay
      </button>
      <button
        onClick={async () => {
          if (window.confirm("Are you sure you want to delete this expense?")) {
            await client.deleteExpense(id);
            setExpense(null);
          }
        }}
      >
        Delete
      </button>
    </div>
  );
};

export default ExpenseDetailsRoute;
