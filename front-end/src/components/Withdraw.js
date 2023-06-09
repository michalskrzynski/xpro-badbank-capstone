import React from "react";
import * as Yup from "yup"

import { UserContext} from "./Context";
import * as APIClient from "../comms/APIClient";
import { Card } from "./Card";
import CashierForm from "./CashierForm";
import { oneFormat } from "../misc/oneFormat";

// OK Includes a Bootstrap card with a form that has:
// OK Withdraw input field 
// OK Withdraw button 
// OK Balance information displays above deposit form on the card

//VALIDATION
// OK Account Overdraft Feature: When a user withdraws a number higher than the account balance, the user receives an alert message on the withdraw page.
// OK Not A Number Alert: User receives an alert if they add something that is not a number. 
// OK Disable deposit button if nothing is input

// Withdraw page should include the following functionality:
// OK Updated Balance: When a user completes the withdrawal form, the number submitted is subtracted from the total balance. 
// OK Success Message: When a user completes the withdrawal form, they receive a success message confirming that their withdraw was processed. 

export default function Withdraw() {
  const {contextValue, updateContextValue} = React.useContext(UserContext);
  const [balance, setBalance] = React.useState(() => contextValue.user.balance);



  const handleMoneyAccepted = ( amount ) => {

    APIClient.withdraw( contextValue.token, amount)
      .then( response => {
        console.log('Deposit responded with:', response);
        contextValue.user = response.body.user;
        updateContextValue( contextValue );

        setBalance( contextValue.user.balance );
        setTimeout( () => alert( `A withdrawal of ${ oneFormat( response.body.withdrawed )} has been processed. Your balance is: ${ oneFormat( contextValue.user.balance ) }`), 50 );
      })
      .catch( err => console.log('ERR when withdrawing', err) ); 

    
  }


  return (
    <Card
      header={`${contextValue.user.name}, withdraw:`}
      title={`Current balance: ${ oneFormat( balance ) }`}
    >
      <CashierForm
        actionText="Withdraw"
        balance={balance}
        handleMoneyAccepted={handleMoneyAccepted}
        amountValidationSchema={
          Yup.number()
          .required("This field is required")
          .min(0.01, "Amount needs to be greater than 0.")
          .max(balance/100, "Withdrawal cannot be larger than your balance.")
        }
      ></CashierForm>
    </Card>
  );
}