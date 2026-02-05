"use client";

import { useEffect, useState } from "react";

type CustomerValue = {
  customer_id: string;
  customer_name: string;
  num_orders: number;
  total_spent: number;
  avg_spent: number;
};

export default function CustomerValuePage() {
  const [data, setData] = useState<CustomerValue[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch(`/api/reports/customer-value?page=${page}&limit=10`, {
      headers: { "x-role": "user" },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((rows) => setData(rows))
      .catch((err) => console.error(err));
  }, [page]);

  return (
    <div>
      <h1>Valor de Clientes</h1>

      <table>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Órdenes</th>
            <th>Total Gastado</th>
            <th>Promedio</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.customer_id}>
              <td>{row.customer_name}</td>
              <td>{row.num_orders}</td>
              <td>${Number(row.total_spent).toFixed(2)}</td>
              <td>${Number(row.avg_spent).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
        >
          Anterior
        </button>
        <button
          onClick={() => setPage((p) => p + 1)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}