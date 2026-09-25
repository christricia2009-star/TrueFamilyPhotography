import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";

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

export default defineConfig({
  plugins: [react(), visitorsDev()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
