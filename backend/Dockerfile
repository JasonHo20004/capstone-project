# --- Giai đoạn 1: Builder ---
FROM node:20-alpine AS builder

WORKDIR /app

# Cài đặt Python/Make/G++ để compile thư viện 'bcrypt'
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Cài dependencies (bao gồm cả devDependencies để có esbuild, prisma cli)
RUN npm install

# Copy source code và prisma schema
COPY . .

# 1. Tạo Prisma Client (Generate cho môi trường Linux của Docker)
RUN npx prisma generate

# 2. Build code TS -> JS bằng esbuild (theo lệnh trong package.json của bạn)
RUN npm run build:esbuild

# --- Giai đoạn 2: Runner (Production) ---
FROM node:20-alpine

WORKDIR /app

# Cài lại thư viện cần thiết để chạy bcrypt (nếu bcrypt ko được build tĩnh)
# Hoặc copy từ builder sang (phức tạp hơn), cách an toàn nhất cho người mới là cài lại dependencies prod
RUN apk add --no-cache python3 make g++

COPY package*.json ./

# Chỉ cài dependencies production (bỏ typescript, esbuild...)
RUN npm install --only=production

# Quan trọng: Copy Prisma Client đã generate từ builder sang
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy code đã build (từ folder dist)
COPY --from=builder /app/dist ./dist

# Copy thư mục prisma schema (cần thiết nếu bạn muốn chạy migrate lúc deploy)
COPY prisma ./prisma

EXPOSE 3000

# Lệnh chạy server
CMD ["node", "dist/server.js"]