"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import kpiStyles from "../kpi.module.css";

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
    fetch(url, {
      headers: { "x-role": "user" },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((rows) => setData(rows))
      .catch((err) => console.error(err));
  }, [search]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Ranking de Productos</h1>

      <div className={kpiStyles.kpiGrid}>
        <div className={kpiStyles.kpiCard}>
          <h3 className={kpiStyles.kpiTitle}>Producto Estrella (Ingresos)</h3>
          <p className={kpiStyles.kpiValue}>
            {data.length > 0 ? data.sort((a,b) => a.rank_revenue - b.rank_revenue)[0].product_name : "-"}
          </p>
        </div>
        <div className={kpiStyles.kpiCard}>
          <h3 className={kpiStyles.kpiTitle}>Ingresos Visibles</h3>
          <p className={kpiStyles.kpiValue}>
            ${data.reduce((acc, row) => acc + Number(row.total_revenue), 0).toFixed(2)}
          </p>
        </div>
      </div>

      <input
        type="text"
        placeholder="Buscar producto..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.input}
      />

      <div className={styles.tableContainer}>
        <table className={styles.table}>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Unidades</th>
            <th>Revenue</th>
            <th>Rank Revenue</th>
            <th>Rank Unidades</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.product_id}>
              <td>{row.product_name}</td>
              <td>{row.total_units}</td>
              <td>${Number(row.total_revenue).toFixed(2)}</td>
              <td>{row.rank_revenue}</td>
              <td>{row.rank_units}</td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  );
}