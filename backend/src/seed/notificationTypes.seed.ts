import { databaseService } from "@/services/database.service";

const NOTIFICATION_TYPES = [
  {
    name: 'RENEWAL_REMINDER',
    isLocked: true
  },
  {
    name: 'EXPIRATION_WARNING',
    isLocked: true
  },
  {
    name: 'FINAL_NOTICE',
    isLocked: true
  },
  {
    name: 'SELLER_ACCOUNT_LOCKED',
    isLocked: true
  },
  {
    name: 'COURSE_SELLER_DISABLED',
    isLocked: true
  }
];

export async function seedNotificationTypes() {
  const prisma = databaseService.getClient();
  
  console.log('Seeding notification types...');
  
  for (const type of NOTIFICATION_TYPES) {
    const existing = await prisma.notificationType.findUnique({
      where: { name: type.name }
    });
    
    if (!existing) {
      await prisma.notificationType.create({
        data: type
      });
      console.log(`Tạo loại thông báo: ${type.name}`);
    } else {
      console.log(`Loại thông báo đã tồn tại: ${type.name}`);
    }
  }
  
  console.log('Quá trình seed loại thông báo hoàn tất!');
}