import React from "react";
import { Card } from "./Card";
import { Link } from "react-router-dom";

import { UserContext } from "./Context";
import { oneFormat } from "../misc/oneFormat";

export default function Welcome() {
  const {contextValue, updateContextValue} = React.useContext(UserContext);

  return (
    <Card
      header={`Welcome ${contextValue.user.name}!`}
      text={
        <div>
          <p>You are logged in. </p>
          <p>Your balance is <b>${ oneFormat( contextValue.user.balance )}</b></p>
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
