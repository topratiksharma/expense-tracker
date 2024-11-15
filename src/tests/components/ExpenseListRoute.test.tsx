import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import ExpenseListRoute from "../../components/ExpenseListRoute";
import { client } from "../../util/roger-api-client";

// Mock the client
jest.mock("../../util/roger-api-client");

const mockExpenses = [
  {
    id: "1",
    createdAt: "2023-01-01",
    vendorName: "Vendor A",
    amount: "100",
    status: "PAID",
    filename: "expense1.pdf",
  },
  {
    id: "2",
    createdAt: "2023-01-02",
    vendorName: "Vendor B",
    amount: "200",
    status: "UNPAID",
    filename: "expense2.pdf",
  },
];

beforeEach(() => {
  (client.listExpenses as jest.Mock).mockResolvedValue(mockExpenses);
});

test("renders without crashing", () => {
  render(
    <Router>
      <ExpenseListRoute />
    </Router>
  );
});

test("displays the title 'Expenses'", () => {
  render(
    <Router>
      <ExpenseListRoute />
    </Router>
  );
  expect(screen.getByText("Expenses")).toBeInTheDocument();
});

test("displays a list of expenses", async () => {
  render(
    <Router>
      <ExpenseListRoute />
    </Router>
  );

  await waitFor(() => {
    expect(screen.getByText("expense1.pdf")).toBeInTheDocument();
    expect(screen.getByText("expense2.pdf")).toBeInTheDocument();
  });
});

test("filters expenses based on search term", async () => {
  render(
    <Router>
      <ExpenseListRoute />
    </Router>
  );

  await waitFor(() => {
    expect(screen.getByText("expense1.pdf")).toBeInTheDocument();
    expect(screen.getByText("expense2.pdf")).toBeInTheDocument();
  });

  fireEvent.change(screen.getByPlaceholderText(/Search expenses/i), {
    target: { value: "expense1" },
  });

  expect(screen.getByText("expense1.pdf")).toBeInTheDocument();
  expect(screen.queryByText("expense2.pdf")).not.toBeInTheDocument();
});

test("links to the correct expense details route", async () => {
  render(
    <Router>
      <ExpenseListRoute />
    </Router>
  );

  await waitFor(() => {
    expect(screen.getByText("expense1.pdf")).toBeInTheDocument();
  });

  const expenseLink = screen.getByText("expense1.pdf").closest("a");
  expect(expenseLink).toHaveAttribute("href", "/expenses/1");
});
