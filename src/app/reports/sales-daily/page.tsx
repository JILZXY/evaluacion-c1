"use client";

import { useEffect, useState } from "react";

type SalesDaily = {
  day: string;
  total_ventas: number;
  tickets: number;
  ticket_promedio: number;
};

export default function SalesDailyPage() {
  const [data, setData] = useState<SalesDaily[]>([]);

  useEffect(() => {
    fetch("/api/reports/sales-daily")
      .then((res) => res.json())
      .then((rows) => setData(rows));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Reporte de Ventas Diarias</h1>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Día</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Total Ventas</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Tickets</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Ticket Promedio</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{row.day}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>${row.total_ventas.toFixed(2)}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{row.tickets}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>${row.ticket_promedio.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}