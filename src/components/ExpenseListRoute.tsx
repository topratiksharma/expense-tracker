import React, { useState } from "react";
import { Link } from "react-router-dom";
import { client, Expense, ExpenseStatus } from "../util/roger-api-client";
import {
  FaFileUpload,
  FaSearch,
  FaFileInvoiceDollar,
  FaDollarSign,
} from "react-icons/fa";

const ExpenseListRoute: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>();
  const [searchTerm, setSearchTerm] = useState<string>("");

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
      <h1 className="mb-4 text-center text-dark">Expenses</h1>
      <div className="mb-3">
        <label className="form-label fw-bold">
        <FaFileUpload /> Upload Files
        </label>
        <input
        type="file"
        multiple
        onChange={handleFileUpload}
        className="form-control rounded"
        />
      </div>
      <div className="mb-3">
        <label className="form-label fw-bold">
        <FaSearch /> Search Expenses
        </label>
        <input
        type="text"
        placeholder="Search expenses"
        className="form-control rounded"
        onChange={(e) => {
          setSearchTerm(e.target.value.toLowerCase());
        }}
        />
      </div>
      <div
        className="list-group rounded"
        style={{ maxHeight: "800px", overflowY: "auto" }}
      >
        {!expenses ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        ) : (
        Object.values(ExpenseStatus).map((status) => (
          <div key={status}>
          <h3 className="text-secondary">{status}</h3>
          {expenses
            .filter(
            (expense) =>
              expense.status === status &&
              expense.filename.toLowerCase().includes(searchTerm)
            )
            .map((expense) => {
            let statusColor;
            switch (expense.status) {
              case ExpenseStatus.ANALYZING:
              statusColor = "text-info";
              break;
              case ExpenseStatus.PAID:
              statusColor = "text-success";
              break;
              case ExpenseStatus.UNPAID:
              statusColor = "text-danger";
              break;
              default:
              statusColor = "text-secondary";
            }
            return (
              <Link
              key={expense.id}
              to={`/expenses/${expense.id}`}
              className="list-group-item list-group-item-action flex-column align-items-start rounded"
              style={{
                backgroundColor: "#ffffff",
                borderColor: "#e0e0e0",
              }}
              >
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1 text-dark">
                <FaFileInvoiceDollar /> {expense.filename}
                </h5>
                <small className="text-muted">
                {expense.createdAt}
                </small>
              </div>
              <p>
                Status:{" "}
                <span className={`mb-1 ${statusColor}`}>
                {expense.status}
                </span>
              </p>
              <small className="text-muted">
                Vendor: {expense.vendorName}
              </small>
              <span className="badge bg-primary rounded-pill float-end">
                <FaDollarSign />
                {expense.amount ?? 0}
              </span>
              </Link>
            );
            })}
          </div>
        ))
        )}
      </div>
      </div>
    </>
  );
};
export default ExpenseListRoute;
