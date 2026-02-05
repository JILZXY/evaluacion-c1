"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

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
    fetch(url, {
      headers: { "x-role": "user" },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((rows) => setData(rows))
      .catch((err) => console.error(err));
  }, [category]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Reporte de Riesgo de Inventario</h1>

      <input
        type="text"
        placeholder="Filtrar por categoría..."
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className={styles.input}
      />

      <div className={styles.tableContainer}>
        <table className={styles.table}>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Stock</th>
            <th>Riesgo (%)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.product_id}>
              <td>{row.product_name}</td>
              <td>{row.category_name}</td>
              <td>{row.stock}</td>
              <td>{Number(row.risk_percent).toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  );
}