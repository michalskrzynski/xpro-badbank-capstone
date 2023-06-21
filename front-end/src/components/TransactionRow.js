import React, {useEffect, useRef } from 'react';
import { Tooltip } from 'bootstrap';

import moment from "moment";
import { oneFormat } from "../misc/oneFormat";

export default function TransactionRow( {transaction} ) {
  const spanRef = useRef(null)
  const t = transaction

  const createdAt = moment(t.date);
  const createdAtFormatted = createdAt.format("YYYY-MM-DD, HH:mm");

  useEffect( () => {
    const tooltip = new Tooltip(spanRef.current);
    return () => {
      tooltip.dispose();
    }
  }, []);


  const prepareTooltipText = (t) => {
    const desc = t.description ? `: ${t.description}` : "";
    return `Transfer to: ${t.toFromText} ${desc}`
  }


  return (
    <tr key={t._id}>
      <th scope="row">
        <small>{createdAtFormatted}</small>
      </th>
      <td>{oneFormat(t.balanceBefore)}</td>
      <td>
        <span
          ref={spanRef}
          {...(t.transType === "credit" || t.transType === "debit"
            ? {
                "data-bs-toggle": "tooltip",
                class: "tooltip-hint",
                title: prepareTooltipText( t ),
              }
            : {})}
        >
          {t.transType} 
        </span>
        &nbsp;
        <span 
          {...(t.transType === "credit" || t.transType === "deposit"
            ? {class: "badge bg-success" }
            : {class: "badge bg-danger" }
          )}>{oneFormat(t.amount)}</span>
      </td>
      <td>{oneFormat(t.balanceAfter)}</td>
    </tr>
  )

}