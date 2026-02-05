"use client";

import Link from "next/link";

export default function DashboardPage() {
  const cards = [
    { title: "Ventas Diarias", href: "/reports/sales-daily", desc: "Resumen de ventas por día" },
    { title: "Top Productos", href: "/reports/top-products", desc: "Ranking de productos más vendidos" },
    { title: "Riesgo Inventario", href: "/reports/inventory-risk", desc: "Productos con stock bajo" },
    { title: "Valor Clientes", href: "/reports/customer-value", desc: "Clientes con mayor gasto" },
    { title: "Métodos de Pago", href: "/reports/payment-mix", desc: "Distribución de pagos" },
    { title: "Canales de Órdenes", href: "/reports/orders-channel-mix", desc: "Órdenes por canal" },
  ];

  return (
    <div>
      <h2 style={{ borderBottom: "2px solid #ccc", paddingBottom: "10px", marginBottom: "20px" }}>Dashboard Principal</h2>
      <p>Selecciona un reporte para visualizar métricas detalladas:</p>

      <div className="dashboard-grid">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="card"
          >
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}