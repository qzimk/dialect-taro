import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import followsApp from "./follows.tsx";
import notificationsApp from "./notifications.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Mount sub-routers
app.route("/make-server-286b7334/follows", followsApp);
app.route("/make-server-286b7334/notifications", notificationsApp);

// Health check endpoint
app.get("/make-server-286b7334/health", (c) => {
  return c.json({ status: "ok" });
});

Deno.serve(app.fetch);