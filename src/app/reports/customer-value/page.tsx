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
    fetch(`/api/reports/customer-value?page=${page}&limit=10`)
      .then((res) => res.json())
      .then((rows) => setData(rows));
  }, [page]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Valor de Clientes</h1>

      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Cliente</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Órdenes</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Total Gastado</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Promedio</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.customer_id}>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{row.customer_name}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{row.num_orders}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>${row.total_spent.toFixed(2)}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>${row.avg_spent.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "10px" }}>
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          style={{ marginRight: "10px", padding: "5px 10px" }}
        >
          Anterior
        </button>
        <button
          onClick={() => setPage((p) => p + 1)}
          style={{ padding: "5px 10px" }}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}