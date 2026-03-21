const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const root = process.cwd();
const port = Number(process.env.PORT || 8080);

const types = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
};

const send = (res, status, body, type = "text/plain; charset=utf-8") => {
  res.writeHead(status, {
    "Content-Type": type,
    "Cache-Control": "no-cache",
    "Referrer-Policy": "strict-origin-when-cross-origin",
  });
  res.end(body);
};

const server = http.createServer((req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host}`);
  let filePath = decodeURIComponent(reqUrl.pathname);

  if (filePath === "/") {
    filePath = "/index.html";
  }

  const safePath = path.normalize(path.join(root, filePath));
  if (!safePath.startsWith(root)) {
    send(res, 403, "Forbidden");
    return;
  }

  fs.stat(safePath, (statErr, stats) => {
    if (statErr) {
      send(res, 404, "Not found");
      return;
    }

    const finalPath = stats.isDirectory() ? path.join(safePath, "index.html") : safePath;
    fs.readFile(finalPath, (readErr, data) => {
      if (readErr) {
        send(res, 404, "Not found");
        return;
      }

      const ext = path.extname(finalPath).toLowerCase();
      send(res, 200, data, types[ext] || "application/octet-stream");
    });
  });
});

server.listen(port, () => {
  console.log(`Local preview running at http://localhost:${port}`);
});
