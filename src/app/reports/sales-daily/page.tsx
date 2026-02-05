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
    fetch("/api/reports/sales-daily", {
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
      <h1>Reporte de Ventas Diarias</h1>
      <table>
        <thead>
          <tr>
            <th>Día</th>
            <th>Total Ventas</th>
            <th>Tickets</th>
            <th>Ticket Promedio</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td>{row.day}</td>
              <td>${Number(row.total_ventas).toFixed(2)}</td>
              <td>{row.tickets}</td>
              <td>${Number(row.ticket_promedio).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}