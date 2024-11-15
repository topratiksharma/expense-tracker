import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { client } from "../util/roger-api-client";

// interface Expense {
//   id: number;
//   name: string;
//   amount: number;
//   date: string;
// }

const ExpenseDetailsRoute: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [expense, setExpense] = useState<any | null>(null);

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
        <strong>Name:</strong> {expense.name}
      </p>
      <p>
        <strong>Amount:</strong> ${expense.amount?.toFixed(2)}
      </p>
      <p>
        <strong>Date:</strong> {expense.date}
      </p>
    </div>
  );
};

export default ExpenseDetailsRoute;
