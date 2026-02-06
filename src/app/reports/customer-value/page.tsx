"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import kpiStyles from "../kpi.module.css";

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
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    fetch(`/api/reports/customer-value?page=${page}&limit=4`, {
      headers: { "x-role": "user" },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((response) => {
        if (Array.isArray(response)) {
             setData(response);
        } else {
             setData(response.data);
             setTotalPages(response.pagination.totalPages);
             setTotalRecords(response.pagination.totalRecords);
        }
      })
      .catch((err) => console.error(err));
  }, [page]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Valor de Clientes</h1>

      <div className={kpiStyles.kpiGrid}>
        <div className={kpiStyles.kpiCard}>
          <h3 className={kpiStyles.kpiTitle}>Total Clientes con Compras</h3>
          <p className={kpiStyles.kpiValue}>
            {totalRecords}
          </p>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Órdenes</th>
            <th>Total Gastado</th>
            <th>Promedio</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row) => (
              <tr key={row.customer_id}>
                <td>{row.customer_name}</td>
                <td>{row.num_orders}</td>
                <td>${Number(row.total_spent).toFixed(2)}</td>
                <td>${Number(row.avg_spent).toFixed(2)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", padding: "20px" }}>
                No hay datos en esta página.
              </td>
            </tr>
          )}
        </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className={styles.button}
          disabled={page === 1}
        >
          Anterior
        </button>
        <span style={{ margin: "0 10px" }}>Página {page} de {totalPages}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          className={styles.button}
          disabled={page >= totalPages}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}