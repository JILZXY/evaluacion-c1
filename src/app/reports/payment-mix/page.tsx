"use client";

import { useEffect, useState } from "react";

type PaymentMix = {
  method: string;
  total_amount: number;
  percent_of_total: number;
};

export default function PaymentMixPage() {
  const [data, setData] = useState<PaymentMix[]>([]);

  useEffect(() => {
    fetch("/api/reports/payment-mix", {
      headers: { "x-role": "user" },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((rows) => setData(rows))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Métodos de Pago</h1>
      <table>
        <thead>
          <tr>
            <th>Método</th>
            <th>Total</th>
            <th>% del Total</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td>{row.method}</td>
              <td>${Number(row.total_amount).toFixed(2)}</td>
              <td>{Number(row.percent_of_total).toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}