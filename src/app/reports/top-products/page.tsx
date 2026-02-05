"use client";

import { useEffect, useState } from "react";

type TopProduct = {
  product_id: string;
  product_name: string;
  total_units: number;
  total_revenue: number;
  rank_revenue: number;
  rank_units: number;
};

export default function TopProductsPage() {
  const [data, setData] = useState<TopProduct[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const url = search
      ? `/api/reports/top-products?search=${encodeURIComponent(search)}`
      : "/api/reports/top-products";
    fetch(url)
      .then((res) => res.json())
      .then((rows) => setData(rows));
  }, [search]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Ranking de Productos</h1>

      <input
        type="text"
        placeholder="Buscar producto..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "10px", padding: "5px", width: "250px" }}
      />

      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Producto</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Unidades</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Revenue</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Rank Revenue</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Rank Unidades</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.product_id}>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{row.product_name}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{row.total_units}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>${row.total_revenue.toFixed(2)}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{row.rank_revenue}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{row.rank_units}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}