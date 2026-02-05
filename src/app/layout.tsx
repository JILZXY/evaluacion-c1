import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Dashboard Cafetería",
  description: "Reportes de ventas y métricas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body style={{ fontFamily: "Arial, sans-serif", margin: 0, color: "black" }}>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          {/* Sidebar */}
          <aside
            style={{
              width: "220px",
              backgroundColor: "#333",
              color: "#fff",
              padding: "20px",
            }}
          >
            <h2 style={{ marginTop: 0, paddingBottom: "10px", borderBottom: "1px solid #555" }}>Dashboard</h2>
            <nav style={{ display: "flex", flexDirection: "column" }}>
              <Link href="/" style={{ color: "#fff", textDecoration: "none", padding: "10px 0", borderBottom: "1px solid #444" }}>
                Inicio
              </Link>
              <Link href="/reports/sales-daily" style={{ color: "#fff", textDecoration: "none", padding: "10px 0", borderBottom: "1px solid #444" }}>
                Ventas Diarias
              </Link>
              <Link href="/reports/top-products" style={{ color: "#fff", textDecoration: "none", padding: "10px 0", borderBottom: "1px solid #444" }}>
                Top Productos
              </Link>
              <Link href="/reports/inventory-risk" style={{ color: "#fff", textDecoration: "none", padding: "10px 0", borderBottom: "1px solid #444" }}>
                Riesgo Inventario
              </Link>
              <Link href="/reports/customer-value" style={{ color: "#fff", textDecoration: "none", padding: "10px 0", borderBottom: "1px solid #444" }}>
                Valor Clientes
              </Link>
              <Link href="/reports/payment-mix" style={{ color: "#fff", textDecoration: "none", padding: "10px 0", borderBottom: "1px solid #444" }}>
                Métodos de Pago
              </Link>
              <Link href="/reports/orders-channel-mix" style={{ color: "#fff", textDecoration: "none", padding: "10px 0", borderBottom: "1px solid #444" }}>
                Canales de Órdenes
              </Link>
            </nav>
          </aside>

          {/* Contenido principal */}
          <main style={{ flex: 1, padding: "20px", backgroundColor: "#f9f9f9" }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}