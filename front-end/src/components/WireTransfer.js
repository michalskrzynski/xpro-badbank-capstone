import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { UserContext } from "./Context";
import * as APIClient from "../comms/APIClient";
import { Card } from "./Card";
import { oneFormat } from "../misc/oneFormat";

import { ConnectionMonitorContext } from "./ConnectionMonitor";



export default function WireTransfer() {
  const { state, setApiPromise } = useContext(ConnectionMonitorContext);
  const { contextValue, updateContextValue } = useContext(UserContext);
  const [balance, setBalance] = useState(() => contextValue.user.balance);

  const formik = useFormik({
    initialValues: {
      receiver: "",
      receiverAccount: "",
      amount: Math.min(1, balance),
      description: ""
    },
    onSubmit: (values) => {
      handleWire(Math.round(values.amount * 100));
    },
    validationSchema: Yup.object({
      receiver: Yup.string()
        .required("Name of the receiver needs to be defined.")
        .min(3, "The receiver name should have at least 3 characters.")
        .max(32, "The name of the receiver can be maximum 32 characters long."),
      receiverAccount: Yup.string()
        .matches(
          /^\d{4}-\d{4}-\d{4}-\d{4}$/,
          "Invalid account number, needs to be like eg: 1234-5678-9012-3456"
        )
        .notOneOf([contextValue.user.account_number], 'This cannot be your account number.')
        .required("Account number is required"),
      amount: Yup.number()
        .required("This field is required")
        .min(0.01, "Amount needs to be greater than 0.")
        .max(
          balance / 100,
          "Transfer amount cannot be larger than your balance."
        ),
      description: Yup.string()
        .max(
          32,
          "Description must be max 32 characters long."
        ),
    }),
  });

  //
  //  Forcing initial form validation. For disabling buttons if needed.
  // * {brackets} used because useEffect function can return only nothing or another function
  // * reverting useEffect
  React.useEffect(() => {
    formik.validateForm();
  }, [balance]);

  const handleWire = () => {
    console.log("Handle WireTransfer");

    const promise = APIClient.wireTransfer(
      contextValue.token,
      formik.values.amount*100,
      formik.values.receiver,
      formik.values.receiverAccount,
      formik.values.description
    )
      .then((response) => {
        console.log("Wire-transfer responded with:", response);
        if( response.body.message === "error" ) return response;

        updateContextValue({ ...contextValue, user: response.body.user });
        setBalance(response.body.user.balance);
        setTimeout(
          () =>
            alert(
              `A transfer of ${oneFormat(response.body.transferred)} to ${
                response.body.transaction.toFromText
              } has been successfully processed. Your balance is: ${oneFormat(
                response.body.user.balance
              )}`
            ),
          50
        );
        formik.handleReset();
        return response;
      })
      .catch((err) => {
        console.log("ERR when transferring", err);
        return err;
      });

    setApiPromise(promise);
  };

  return (
    <Card
      header={`${contextValue.user.name}, Wire transfer:`}
      title={`Current balance: ${oneFormat(balance)}`}
    >
      {state.data && state.data.body.error ? (
          <div className="alert alert-danger py-1 px-3 mb-1" role="alert">
            <small>{state.data.body.error}</small>
          </div>
        ) : null}
      <form onSubmit={formik.handleSubmit}>
        <div className="form-group">
          <label htmlFor="receiver">Receiver name</label>
          {formik.touched.receiver && formik.errors.receiver && (
            <div className="alert alert-danger py-1 px-3 mb-2" role="alert">
              <small>{formik.errors.receiver}</small>
            </div>
          )}
          <input
            type="text"
            id="receiver"
            className="form-control"
            value={formik.values.receiver}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="John Doe"
          />
        </div>
        <div className="form-group">
          <label htmlFor="receiverAccount">Receiver Account Number</label>
          {formik.touched.receiverAccount && formik.errors.receiverAccount && (
            <div className="alert alert-danger py-1 px-3 mb-2" role="alert">
              <small>{formik.errors.receiverAccount}</small>
            </div>
          )}
          <input
            type="text"
            id="receiverAccount"
            className="form-control"
            value={formik.values.receiverAccount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="1234-5678-9012-3456"
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Amount</label>
          {formik.touched.amount && formik.errors.amount && (
            <div className="alert alert-danger py-1 px-3 mb-2" role="alert">
              <small>{formik.errors.amount}</small>
            </div>
          )}
          <input
            type="number"
            id="amount"
            className="form-control"
            value={formik.values.amount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Short description</label>
          {formik.touched.description && formik.errors.description && (
            <div className="alert alert-danger py-1 px-3 mb-2" role="alert">
              <small>{formik.errors.description}</small>
            </div>
          )}
          <input
            type="text"
            id="description"
            className="form-control"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="zoo ticket cost return"
          />
        </div>

        <div className="d-flex justify-content-end">
          <button
            type="submit"
            className="btn btn-primary mt-4"
            disabled={(formik.errors.amount || state.loading) && "disabled"}
          >
            {state.loading ? "Loading..." : "Send transfer"}
          </button>
        </div>
      </form>
    </Card>
  );
}
