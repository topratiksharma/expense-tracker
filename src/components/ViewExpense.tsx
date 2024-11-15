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
    <div className="container mt-5">
      <div className="card shadow-lg">
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h2 className="mb-0">Expense Detail</h2>
        <div>
        <button
          className="btn btn-success me-2"
          onClick={async () => {
          await client.patchExpense(id, { status: ExpenseStatus.PAID });
          setExpense({ ...expense, status: ExpenseStatus.PAID });
          }}
          disabled={expense.status === ExpenseStatus.PAID}
        >
          {expense.status === ExpenseStatus.PAID ? "Paid" : "Pay"}
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
      </div>
      <div className="card-body">
        <div className="row">
        <div className="col-md-6">
          <p className="card-text d-flex align-items-center">
          <strong className="me-2">Name:</strong> {expense.filename}
          </p>
          <p className="card-text d-flex align-items-center">
          <strong className="me-2">Amount:</strong> ${expense.amount}
          </p>
          <p className="card-text d-flex align-items-center">
          <strong className="me-2">Status:</strong>
          <span
            className={`badge ${
            expense.status === ExpenseStatus.PAID
              ? "bg-success"
              : "bg-warning"
            }`}
          >
            {expense.status}
          </span>
          </p>
        </div>
        <div className="col-md-6">
          <p className="card-text d-flex align-items-center">
          <strong className="me-2">Vendor:</strong> {expense.vendorName}
          </p>
          <p className="card-text d-flex align-items-center">
          <strong className="me-2">Date:</strong>{" "}
          {new Date(expense.createdAt).toLocaleDateString()}
          </p>
        </div>
        </div>
        <div className="d-flex justify-content-end mt-4">
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
    </div>
  );
};

export default ViewExpense;
