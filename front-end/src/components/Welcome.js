import React, { useEffect } from "react";
import { Card } from "./Card";
import moment from "moment";

import { oneFormat } from "../misc/oneFormat";
import { UserContext } from "./Context";
import TransactionRow from "./TransactionRow";
import * as APIClient from "../comms/APIClient";

export default function Welcome() {
  const { contextValue, updateContextValue } = React.useContext(UserContext);
  const [transactions, setTransactions] = React.useState(Array());

  useEffect(() => {
    APIClient.transactions(contextValue.token)
      .then((response) => setTransactions(response.body.transactions))
      .catch((error) => console.error("Transactions retrieve error, ", error));
  }, []);

  const transactionRows = transactions.map((t) => {

    return (
      <TransactionRow transaction={t}/>
    );
  });

  return (
    <Card
      header={`Welcome ${contextValue.user.name}! You are logged in.`}
      text={
        <div>
          <p>
            Your balance is <b>{oneFormat(contextValue.user.balance)}</b>. Last
            transactions below:
          </p>
        </div>
      }
    >
      <table className="table">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Date</th>
            <th scope="col">$ Before</th>
            <th scope="col">Operation</th>
            <th scope="col">$ After</th>
          </tr>
        </thead>
        <tbody>{transactionRows}</tbody>
      </table>
    </Card>
  );
}
