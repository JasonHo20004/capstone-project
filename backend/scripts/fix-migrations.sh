#!/bin/sh
# Script đơn giản để tự động fix lỗi migration
# Không cần chỉnh sửa file migration

echo "Đang kiểm tra và fix lỗi migration..."

# Lấy danh sách các migration có thể bị failed
MIGRATIONS="20251008152755_init 20251013094436_add_is_locked_to_notification_type 20251025145930_dev_1 20251125161859_ 20251127143426_add_is_email_verified"

# Thử resolve tất cả migrations bị failed
for migration in $MIGRATIONS; do
    echo "Đang kiểm tra migration: $migration"
    # Thử mark as rolled-back (an toàn hơn)
    npx prisma migrate resolve --rolled-back "$migration" 2>/dev/null && echo "  ✓ Đã resolve: $migration" || echo "  - Migration $migration không bị failed"
done

echo "Đang deploy migrations..."
npx prisma migrate deploy

echo "Hoàn tất!"





