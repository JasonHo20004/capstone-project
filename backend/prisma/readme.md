# Hướng dẫn Prisma Migration

## Bước 1: Tạo model đầu tiên

Edit file `prisma/schema.prisma` với nội dung ví dụ:

```prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
}
```

### Chạy migration trong terminal:

```bash
npx prisma migrate dev --name init
```

> **Lưu ý:** Lúc này bảng User được tạo trong database, và Prisma Client cũng được generate.

## Bước 2: Thêm field mới

Bây giờ bạn muốn thêm field `name` cho User:

```prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?   // 👈 thêm mới
}
```

## Bước 3: Chạy migration

```bash
npx prisma migrate dev --name add_name_to_user
```
> **Lưu ý:** name viết ngắn gọn, xúc tích.

### Kết quả:

- Prisma tạo file SQL trong `prisma/migrations/.../migration.sql`
- Cập nhật bảng User trong database
- Tự động chạy `prisma generate` để update client