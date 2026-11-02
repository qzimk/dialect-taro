import { Hono } from "npm:hono";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Key structure: `follows:${userId}:${targetUserId}` -> value (timestamp)
// Key structure: `followers:${targetUserId}:${userId}` -> value (timestamp)

// Follow a user
app.post("/", async (c) => {
  const body = await c.req.json();
  const { userId, targetUserId, targetUserName } = body;

  if (!userId || !targetUserId) {
    return c.json({ error: "Missing userId or targetUserId" }, 400);
  }

  // Store the follow relationship
  await kv.set(`follows:${userId}:${targetUserId}`, {
    targetUserId,
    targetUserName,
    timestamp: new Date().toISOString()
  });

  // Store the follower relationship (inverse)
  await kv.set(`followers:${targetUserId}:${userId}`, {
    userId,
    timestamp: new Date().toISOString()
  });

  // Create a notification for the target user
  const notificationId = `notif-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  await kv.set(`notifications:${targetUserId}:${notificationId}`, {
    id: notificationId,
    type: 'follow',
    fromUserId: userId,
    content: `用户 ${userId} 关注了你`,
    isRead: false,
    timestamp: new Date().toISOString()
  });

  return c.json({ success: true });
});

// Unfollow a user
app.delete("/", async (c) => {
  const body = await c.req.json();
  const { userId, targetUserId } = body;

  if (!userId || !targetUserId) {
    return c.json({ error: "Missing userId or targetUserId" }, 400);
  }

  await kv.del(`follows:${userId}:${targetUserId}`);
  await kv.del(`followers:${targetUserId}:${userId}`);

  return c.json({ success: true });
});

// Get following list for a user
app.get("/:userId", async (c) => {
  const userId = c.req.param("userId");
  
  // kv_store doesn't have a list function that returns keys by prefix, 
  // but the instructions say "getByPrefix return an array of values".
  // Let's use getByPrefix.
  
  const follows = await kv.getByPrefix(`follows:${userId}:`);
  return c.json({ follows });
});

export default app;
