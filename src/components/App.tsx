import React from "react";
import { Router, Switch, Route, Redirect, NavLink } from "react-router-dom";
import { createBrowserHistory } from "history";
import { ReactComponent as Logo } from "../images/logo-negative.svg";
import ExpenseDetailsRoute from "./ExpenseDetailsRoute";

const history = createBrowserHistory();

const ExpenseListRoute = React.lazy(() => import("./ExpenseListRoute"));
const SettingsRoute = React.lazy(() => import("./SettingsRoute"));

export const App: React.FC = () => {
  return (
    <Router history={history}>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <span className="navbar-brand">
          <Logo />
        </span>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <NavLink to="/expenses" className="nav-link">
                Expenses
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/settings" className="nav-link">
                Settings
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
      <main className="container py-4">
        <React.Suspense
          fallback={
            <div className="d-flex justify-content-center">
              <div className="spinner-border text-primary" />
            </div>
          }
        >
          <Switch>
            <Route path="/expenses" exact component={ExpenseListRoute} />
            <Route path="/settings" exact component={SettingsRoute} />
            <Route path="/expenses/:id" component={ExpenseDetailsRoute} />
            <Redirect path="/" exact to="/expenses" />
          </Switch>
        </React.Suspense>
      </main>
    </Router>
  );
};
