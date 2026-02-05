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
    fetch("/api/reports/orders-channel-mix")
      .then((res) => res.json())
      .then((rows) => setData(rows));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Distribución de Órdenes por Canal</h1>

      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Canal</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Órdenes</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>% del Total</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{row.channel}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{row.total_orders}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{row.percent_of_total}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}