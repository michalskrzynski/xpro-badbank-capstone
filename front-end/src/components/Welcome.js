import React from "react";
import { Card } from "./Card";
import { Link } from "react-router-dom";

import { UserContext } from "./Context";

export default function Welcome() {
  const ctx = React.useContext(UserContext);

  return (
    <Card
      header={ctx.user.email}
      text={
        <div className="d-flex mb-3">
          You are logged in as [....]. Your balance is [....]
        </div>
      }
    >
      <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
        <Link to="/deposit/" className="nav-link">
          <button type="button" className="btn btn-primary px-4 gap-3">
            Deposit
          </button>
        </Link>
        <Link to="/withdraw/" className="nav-link">
          <button type="button" className="btn btn-outline-secondary px-4">
            Withdraw
          </button>
        </Link>
      </div>
    </Card>
  );
}
