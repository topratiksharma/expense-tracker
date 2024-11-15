import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { client, Expense, ExpenseStatus } from "../util/roger-api-client";

const ViewExpense: React.FC = () => {
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
    <>
      <div className="container mt-5">
        <div className="card">
          <div className="card-header">
            <h2>Expense Detail</h2>
          </div>
          <div className="card-body">
            <p className="card-text">
              <strong>Name:</strong> {expense.filename}
            </p>
            <p className="card-text">
              <strong>Amount:</strong> ${expense.amount}
            </p>
            <p className="card-text">
              <strong>Status:</strong> {expense.status}
            </p>
            <p className="card-text">
              <strong>Vendor:</strong> {expense.vendorName}
            </p>
            <p className="card-text">
              <strong>Date:</strong>{" "}
              {new Date(expense.createdAt).toLocaleDateString()}
            </p>
            <div className="d-flex justify-content-between">
              <button
                className="btn btn-success"
                onClick={async () => {
                  await client.patchExpense(id, { status: ExpenseStatus.PAID });
                  setExpense({ ...expense, status: ExpenseStatus.PAID });
                }}
              >
                Pay
              </button>
              <button
                className="btn btn-danger"
                onClick={async () => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete this expense?"
                    )
                  ) {
                    await client.deleteExpense(id);
                    setExpense(null);
                  }
                }}
              >
                Delete
              </button>
            </div>
            <button
              className="btn btn-secondary"
              onClick={() => {
                window.location.href = "/expenses";
              }}
            >
              Back to List
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewExpense;
