"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import kpiStyles from "../kpi.module.css";

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
    <div className={styles.container}>
      <h1 className={styles.title}>Reporte de Ventas Diarias</h1>

      <div className={kpiStyles.kpiGrid}>
        <div className={kpiStyles.kpiCard}>
          <h3 className={kpiStyles.kpiTitle}>Ventas Totales</h3>
          <p className={kpiStyles.kpiValue}>
            ${data.reduce((acc, row) => acc + Number(row.total_ventas), 0).toFixed(2)}
          </p>
        </div>
        <div className={kpiStyles.kpiCard}>
          <h3 className={kpiStyles.kpiTitle}>Tickets Totales</h3>
          <p className={kpiStyles.kpiValue}>
            {data.reduce((acc, row) => acc + Number(row.tickets), 0)}
          </p>
        </div>
        <div className={kpiStyles.kpiCard}>
          <h3 className={kpiStyles.kpiTitle}>Ticket Promedio Global</h3>
          <p className={kpiStyles.kpiValue}>
            ${(
              data.reduce((acc, row) => acc + Number(row.total_ventas), 0) / 
              (data.reduce((acc, row) => acc + Number(row.tickets), 0) || 1)
            ).toFixed(2)}
          </p>
        </div>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
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
    </div>
  );
}