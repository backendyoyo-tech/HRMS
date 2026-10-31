
import "dotenv/config";

import app from "./app.js";

const PORT = Number(process.env.PORT) || 5000;

const server = app.listen(PORT, () => {
  console.log(`YOYO HRMS Backend running on port ${PORT}`);
  console.log(`Health API: http://localhost:${PORT}/api/v1/health`);
});

process.on("SIGTERM", () => {
  server.close(() => {
    console.log("HRMS server closed");
    process.exit(0);
  });
});
