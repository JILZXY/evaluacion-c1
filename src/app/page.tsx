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
      <h2>Dashboard Principal</h2>
      <p>Selecciona un reporte para visualizar métricas detalladas:</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            style={{
              display: "block",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "15px",
              textDecoration: "none",
              color: "#333",
              backgroundColor: "#f9f9f9",
              boxShadow: "2px 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ marginTop: 0 }}>{card.title}</h3>
            <p>{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}