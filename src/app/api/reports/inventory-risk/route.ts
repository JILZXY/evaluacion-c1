import { NextResponse } from "next/server";
import { z } from "zod";
import { pool } from "@/../lib/db";

// 🔒 WHITELIST: Solo estas categorías son válidas
const ALLOWED_CATEGORIES = [
  'Café', 'Tés', 'Bebidas frías', 'Postres', 'Snacks', 
  'Sandwiches', 'Wraps', 'Ensaladas', 'Jugos', 'Smoothies', 
  'Panadería', 'Helados', 'Desayunos', 'Comida rápida', 
  'Vegano', 'Sin gluten', 'Especialidades', 'Promociones', 
  'Temporada', 'Otros'
] as const;

// Validación de filtros
const querySchema = z.object({
  category: z.enum(ALLOWED_CATEGORIES).optional(),
});

export async function GET(req: Request) {
  try {
    const role = req.headers.get("x-role");
    if (role !== process.env.ROLE_ADMIN && role !== process.env.ROLE_USER) {
       return NextResponse.json({ error: "Acceso no autorizado" }, { status: 401 });
    }
    const url = new URL(req.url);
    const params = querySchema.parse({
      category: url.searchParams.get("category") || undefined,
    });

    let query = `SELECT product_id, product_name, category_name, stock, risk_percent 
                 FROM vw_inventory_risk WHERE 1=1`;
    const values: any[] = [];

    if (params.category) {
      values.push(params.category);
      query += ` AND category_name = $${values.length}`;
    }

    query += ` ORDER BY stock ASC`;

    const result = await pool.query(query, values);

    return NextResponse.json(result.rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}