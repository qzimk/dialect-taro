import { Hono } from "npm:hono";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Key structure: `notifications:${userId}:${notificationId}` -> value (notification object)

// Get notifications for a user
app.get("/:userId", async (c) => {
  const userId = c.req.param("userId");
  const notifications = await kv.getByPrefix(`notifications:${userId}:`);
  
  // Sort by timestamp desc
  notifications.sort((a: any, b: any) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  return c.json({ notifications });
});

// Create a notification (generic)
app.post("/", async (c) => {
  const body = await c.req.json();
  const { targetUserId, type, content, fromUserId } = body;

  if (!targetUserId || !content) {
    return c.json({ error: "Missing required fields" }, 400);
  }

  const notificationId = `notif-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const notification = {
    id: notificationId,
    type: type || 'system',
    fromUserId,
    content,
    isRead: false,
    timestamp: new Date().toISOString()
  };

  await kv.set(`notifications:${targetUserId}:${notificationId}`, notification);

  return c.json({ success: true, notification });
});

// Mark notification as read
app.put("/:userId/:notificationId/read", async (c) => {
  const userId = c.req.param("userId");
  const notificationId = c.req.param("notificationId");

  const key = `notifications:${userId}:${notificationId}`;
  const notification = await kv.get(key);

  if (notification) {
    const updated = { ...notification, isRead: true };
    await kv.set(key, updated);
    return c.json({ success: true, notification: updated });
  }

  return c.json({ error: "Notification not found" }, 404);
});

// Mark all as read
app.put("/:userId/read-all", async (c) => {
  const userId = c.req.param("userId");
  const notifications = await kv.getByPrefix(`notifications:${userId}:`);
  
  for (const notif of notifications) {
    if (!notif.isRead) {
      await kv.set(`notifications:${userId}:${notif.id}`, { ...notif, isRead: true });
    }
  }
  
  return c.json({ success: true });
});

export default app;
