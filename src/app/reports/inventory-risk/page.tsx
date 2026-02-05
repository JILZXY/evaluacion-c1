"use client";

import { useEffect, useState } from "react";

type InventoryRisk = {
  product_id: string;
  product_name: string;
  category_name: string;
  stock: number;
  risk_percent: number;
};

export default function InventoryRiskPage() {
  const [data, setData] = useState<InventoryRisk[]>([]);
  const [category, setCategory] = useState("");

  useEffect(() => {
    const url = category
      ? `/api/reports/inventory-risk?category=${encodeURIComponent(category)}`
      : "/api/reports/inventory-risk";
    fetch(url)
      .then((res) => res.json())
      .then((rows) => setData(rows));
  }, [category]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Reporte de Riesgo de Inventario</h1>

      <input
        type="text"
        placeholder="Filtrar por categoría..."
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{ marginBottom: "10px", padding: "5px", width: "250px" }}
      />

      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Producto</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Categoría</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Stock</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Riesgo (%)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.product_id}>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{row.product_name}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{row.category_name}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{row.stock}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{row.risk_percent}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}