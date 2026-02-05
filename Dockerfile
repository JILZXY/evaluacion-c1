# Imagen base oficial de Node.js
FROM node:20-alpine AS builder

# Directorio de trabajo
WORKDIR /app

# Copiar dependencias
COPY package.json package-lock.json* ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Construir la aplicación Next.js
RUN npm run build

# =========================
# Etapa final
# =========================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copiar archivos necesarios desde builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD ["npm", "start"]