import React, {useContext, useState} from "react";
import * as Yup from "yup";

import { UserContext } from "./Context";
import * as APIClient from "../comms/APIClient";
import { Card } from "./Card";
import CashierForm from "./CashierForm";
import { oneFormat } from "../misc/oneFormat";

import {ConnectionMonitorContext} from "./ConnectionMonitor";


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
  const {state, setApiPromise } = useContext(ConnectionMonitorContext);
  const {contextValue, updateContextValue} = useContext(UserContext);
  const [balance, setBalance] = useState(() => contextValue.user.balance);

  const handleMoneyAccepted = ( amount ) => {
    console.log('Handle money accepted');

    const promise = APIClient.deposit( contextValue.token, amount )
      .then( response => {
        console.log('Deposit responded with:', response);
        updateContextValue( {...contextValue, user: response.body.user} );

        setBalance( response.body.user.balance );
        setTimeout( () => alert( `A deposit of ${ oneFormat(response.body.deposited)} has been successfully processed. Your balance is: ${ oneFormat(response.body.user.balance) }`), 50 );
        return response;
      })
      .catch( err => {console.log('ERR when depositing', err); return err} ); 
  
    setApiPromise( promise );
  };




  return (
    <Card
      header={`${contextValue.user.name}, deposit:`}
      title={`Current balance: ${oneFormat(balance)}`}
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
