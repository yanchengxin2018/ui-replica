const path = require("path");
const { execFileSync } = require("child_process");
const http = require("http");
const handler = require("serve-handler");
const sharp = require("sharp");

async function main() {
  const edgePath = "/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
  const rootDir = path.resolve(__dirname, "..");
  const largePng = "/mnt/c/Users/Public/google-replica-large.png";
  const targetPng = path.join(rootDir, "preview.png");

  const server = http.createServer((request, response) => {
    return handler(request, response, { public: rootDir });
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 38123;

  try {
    execFileSync(
      edgePath,
      [
        "--headless",
        "--disable-gpu",
        "--hide-scrollbars",
        "--window-size=1300,760",
        "--screenshot=C:\\Users\\Public\\google-replica-large.png",
        `http://127.0.0.1:${port}/index.html?v=${Date.now()}`,
      ],
      { stdio: "pipe" },
    );

    await sharp(largePng)
      .extract({ left: 84, top: 4, width: 1109, height: 652 })
      .toFile(targetPng);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
