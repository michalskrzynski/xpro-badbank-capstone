import React from "react";
import { useState } from "react";
import * as Yup from "yup";

import { UserContext, loadAllUserData, saveAllUserData } from "./Context";
import { Card } from "./Card";
import CashierForm from "./CashierForm";
import request from "superagent";

// Includes a Bootstrap card with a form that has:
// OK Deposit input field
// OK Deposit button
// OK Balance information displays above deposit form on the card

// OK Not A Number Alert: User receives an alert if they add something that is not a number.
// OK Negative Deposit Alert: User receives an alert if they try to deposit a negative number.
// OK Disable deposit button if nothing is input

// Deposit page should include the following functionality:
// OK Success Message: When a user completes the deposit form, they receive a success message confirming their deposit was received.


export default function Deposit() {
  const {contextValue, updateContextValue} = React.useContext(UserContext);
  const [balance, setBalance] = useState(() => contextValue.user.balance);


  const handleMoneyAccepted = ( amount ) => {
    const depositAmount = {amount};
    request
      .post('http://localhost:3001/api/v1/users/1/deposit')
      .send(depositAmount)
      .set('Content-Type', 'application/json')
      .end( (err, res) => {
        if(err) {
          console.error(err);
        }
        else {
          const newBalance = res.body.data.balance;
          setBalance( newBalance )

          //alert with microtimeout, for apropiate on-screen result
          setTimeout( () => alert( `A deposit of ${amount} has been accepted. Your balance is: ${newBalance}`), 50);
        }
      })
  }


  return (
    <Card
      header={`${contextValue.user.name}, deposit:`}
      title={`Current balance: ${balance}`}
    >
      <CashierForm
        actionText="Deposit"
        balance={balance}
        handleMoneyAccepted={handleMoneyAccepted}
        amountValidationSchema={
          Yup.number()
            .required("This field is required")
            .min(0.01, "You have to deposit at least 0.01")
        }
      ></CashierForm>
    </Card>
  );
}
