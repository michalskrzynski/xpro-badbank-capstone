import React, {useContext} from "react";
import { Card } from "./Card";
import { Link } from "react-router-dom";

import { UserContext } from "./Context";

export default function Home() {
  const {contextValue, updateContextValue} = useContext(UserContext);

  return (
    <Card
      header="Welcome to Bad Bank"
      text={
        <div className="d-flex mb-3">
          <img className="img-fluid" src="./img/scrooge.jpeg" width="50%" alt="bank-logo"/>
          <div>
            <p>Not so bad any more, <em>but still doing our best!</em></p>
            <hr/>
            <p>Due to the recent requirements from authorities, we've been obliged
            to implement few security measures, like:
            </p>
            <ul>
              <li>Secure password storage and authentication (with Amazon Cognito).</li>
              <li>Access token refresh.</li>
              <li>Email verification with Amazon Cognito.</li>
            </ul>
            <p><b>Also</b> we present you some new functionality:</p>
            <ol>
              <li>Transaction history right after login.</li>
              <li>Personal account number BBAN.</li>
              <li>Wire transfer option (by BBAN).</li>
            </ol>
          </div>
        </div>
      }
    >
      <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
        {contextValue.user.name === null ? (
        <>
          <Link to="/create-account/" className="nav-link">
            <button type="button" className="btn btn-primary px-4 gap-3">
              Create New Account
            </button>
          </Link>
          <Link to="/login/" className="nav-link">
            <button type="button" className="btn btn-outline-secondary px-4">
              Login
            </button>
          </Link>
        </>
        ) : (
        <>
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
        </>
        )}
      </div>
    </Card>
  );
}
