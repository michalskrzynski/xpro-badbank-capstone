import React from "react";
import { useState } from "react";
import * as Yup from "yup";

import { UserContext } from "./Context";
import * as APIClient from "../comms/APIClient";
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

    APIClient.deposit( contextValue.token, amount, (err, response ) => {
      if(err) console.log('ERR when depositing', err)
      else {
        console.log('Deposit responded with:', response);
        contextValue.user = response.body.user;
        updateContextValue( contextValue );

        const newBalance = contextValue.user.balance;
        setBalance( newBalance );
        setTimeout( () => alert( `A deposit of ${response.body.deposited} has been successfully processed. Your balance is: ${newBalance}`), 50 );
      }
    });
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
