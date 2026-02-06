"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import kpiStyles from "../kpi.module.css";

type PaymentMix = {
  method: string;
  total_amount: number;
  percent_of_total: number;
};

export default function PaymentMixPage() {
  const [data, setData] = useState<PaymentMix[]>([]);

  useEffect(() => {
    fetch("/api/reports/payment-mix", {
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
    <div className={styles.container}>
      <h1 className={styles.title}>Métodos de Pago</h1>

      <div className={kpiStyles.kpiGrid}>
        <div className={kpiStyles.kpiCard}>
          <h3 className={kpiStyles.kpiTitle}>Método Favorito</h3>
          <p className={kpiStyles.kpiValue}>
            {data.length > 0 ? data.sort((a,b) => Number(b.percent_of_total) - Number(a.percent_of_total))[0].method : "-"}
          </p>
        </div>
        <div className={kpiStyles.kpiCard}>
          <h3 className={kpiStyles.kpiTitle}>Total Procesado</h3>
          <p className={kpiStyles.kpiValue}>
            ${data.reduce((acc, row) => acc + Number(row.total_amount), 0).toFixed(2)}
          </p>
        </div>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
        <thead>
          <tr>
            <th>Método</th>
            <th>Total</th>
            <th>% del Total</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td>{row.method}</td>
              <td>${Number(row.total_amount).toFixed(2)}</td>
              <td>{Number(row.percent_of_total).toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  );
}