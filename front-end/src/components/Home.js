import React from "react";
import { Card } from "./Card";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <Card
      header="Welcome to Bad Bank"
      text={
        <div className="d-flex mb-3">
          <img className="img-fluid" src="./img/scrooge.svg" width="30%" alt="bank-logo"/>
          <div>
            <p>Not so bad any more, <em>but still doing our best!</em></p>
            <p>Due to the recent requirements from authorities, we've been obliged
            to implement few security measures, like
            </p>
            <ul>
              <li>Secure password storage and authentication (with Amazon Cognito).</li>
              <li>Email verification with Amazon Cognito.</li>
            </ul>
          </div>
        </div>
      }
    >
      <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
        <Link to="/deposit/" className="nav-link">
          <button type="button" className="btn btn-primary px-4 gap-3">
            Deposit
          </button>
        </Link>
        <Link to="/all-data/" className="nav-link">
          <button type="button" className="btn btn-outline-secondary px-4">
            See other users' login details (yay!)
          </button>
        </Link>
      </div>
    </Card>
  );
}
