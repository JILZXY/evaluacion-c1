"use client";

import { useEffect, useState } from "react";

type OrdersChannelMix = {
  channel: string;
  total_orders: number;
  percent_of_total: number;
};

export default function OrdersChannelMixPage() {
  const [data, setData] = useState<OrdersChannelMix[]>([]);

  useEffect(() => {
    fetch("/api/reports/orders-channel-mix", {
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
      <h1>Distribución de Órdenes por Canal</h1>

      <table>
        <thead>
          <tr>
            <th>Canal</th>
            <th>Órdenes</th>
            <th>% del Total</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td>{row.channel}</td>
              <td>{row.total_orders}</td>
              <td>{Number(row.percent_of_total).toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}