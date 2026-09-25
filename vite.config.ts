import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { loadEnv } from "vite";
import { deliverSignup, listSignups } from "./api/notify";

function visitorsDev(): Plugin {
  const file = path.resolve(__dirname, ".data/visitors.json");
  return {
    name: "visitors-dev",
    configureServer(server) {
      server.middlewares.use("/api/visitors", (req, res) => {
        const url = new URL(req.url || "/", "http://localhost");
        const cookie = req.headers.cookie || "";
        const remembered = /(?:^|;\s*)tfp_vid=/.test(cookie) || url.searchParams.get("seen") === "1";
        let count = 0;
        try {
          count = JSON.parse(fs.readFileSync(file, "utf8")).count ?? 0;
        } catch {
          count = 0;
        }
        if (!remembered) {
          count += 1;
          fs.mkdirSync(path.dirname(file), { recursive: true });
          fs.writeFileSync(file, JSON.stringify({ count }));
        }
        const headers = ["Content-Type: application/json", "Cache-Control: no-store"];
        if (!/(?:^|;\s*)tfp_vid=/.test(cookie)) {
          headers.push(
            `Set-Cookie: tfp_vid=${crypto.randomUUID()}; Path=/; Max-Age=31536000; SameSite=Lax`,
          );
        }
        res.statusCode = 200;
        for (const header of headers) {
          const split = header.indexOf(": ");
          res.setHeader(header.slice(0, split), header.slice(split + 2));
        }
        res.end(JSON.stringify({ count }));
      });
    },
  };
}

function notifyDev(): Plugin {
  return {
    name: "notify-dev",
    configureServer(server) {
      server.middlewares.use("/api/notify", (req, res) => {
        if (req.method === "GET") {
          if (req.headers["x-studio-pin"] !== "8288824") {
            res.statusCode = 401;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "unauthorized" }));
            return;
          }
          listSignups()
            .then((rows) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(rows));
            })
            .catch(() => {
              res.statusCode = 502;
              res.end(JSON.stringify([]));
            });
          return;
        }
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end("Method not allowed");
          return;
        }
        const chunks: Buffer[] = [];
        req.on("data", (chunk) => chunks.push(chunk as Buffer));
        req.on("end", async () => {
          try {
            const body = JSON.parse(Buffer.concat(chunks).toString() || "{}");
            const result = await deliverSignup(body);
            res.statusCode = result.ok ? 200 : 502;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(result));
          } catch {
            res.statusCode = 502;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: false }));
          }
        });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  if (env.SIGNUP_STORE) process.env.SIGNUP_STORE = env.SIGNUP_STORE;
  return {
  plugins: [react(), visitorsDev(), notifyDev()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
};});
