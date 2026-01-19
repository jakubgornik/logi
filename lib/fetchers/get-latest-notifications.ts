import { prisma } from "@/lib/prisma";
import { subHours } from "date-fns";

export async function getLatestNotifications(userId: string) {
  try {
    const twentyFourHoursAgo = subHours(new Date(), 24);

    const notifications = await prisma.notification.findMany({
      where: {
        userId: userId,
        createdAt: {
          gte: twentyFourHoursAgo,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const mappedNotifications = notifications.map((n) => ({
      id: n.id,
      type: n.type,
    }));

    return mappedNotifications;
  } catch (error) {
    throw new Error("Failed to load notifications");
  }
}
