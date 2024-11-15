import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router, Route, MemoryRouter } from "react-router-dom";
import ViewExpense from "../../components/ViewExpense";
import { client } from "../../util/roger-api-client";

// Mock the client
jest.mock("../../util/roger-api-client");

const mockExpense = {
  id: "1",
  createdAt: "2023-01-01",
  vendorName: "Vendor A",
  amount: "100",
  status: "UNPAID",
  filename: "expense1.pdf",
};

beforeEach(() => {
  (client.getExpense as jest.Mock).mockResolvedValue(mockExpense);
  (client.patchExpense as jest.Mock).mockResolvedValue({
    ...mockExpense,
    status: "PAID",
  });
  (client.deleteExpense as jest.Mock).mockResolvedValue({});
});

test("renders without crashing", () => {
  render(
    <MemoryRouter initialEntries={["/expenses/1"]}>
      <Route path="/expenses/:id">
        <ViewExpense />
      </Route>
    </MemoryRouter>
  );
});

test("displays loading state initially", () => {
  render(
    <MemoryRouter initialEntries={["/expenses/1"]}>
      <Route path="/expenses/:id">
        <ViewExpense />
      </Route>
    </MemoryRouter>
  );
  expect(screen.getByText("Loading...")).toBeInTheDocument();
});

test("fetches and displays expense details", async () => {
  render(
    <MemoryRouter initialEntries={["/expenses/1"]}>
      <Route path="/expenses/:id">
        <ViewExpense />
      </Route>
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText("expense1.pdf")).toBeInTheDocument();
    expect(screen.getByText("Vendor A")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("UNPAID")).toBeInTheDocument();
  });
});

test("marks expense as paid", async () => {
  render(
    <MemoryRouter initialEntries={["/expenses/1"]}>
      <Route path="/expenses/:id">
        <ViewExpense />
      </Route>
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText("expense1.pdf")).toBeInTheDocument();
  });

  fireEvent.click(screen.getByText("Pay"));

  await waitFor(() => {
    expect(screen.getByText("PAID")).toBeInTheDocument();
  });
});