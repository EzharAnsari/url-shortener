const express = require("express");
require("dotenv").config();

const routes = require("./routes/urlRoutes");
const initDatabase = require("./db/init")

const app = express();
app.use(express.json());
app.use("/", routes);

const PORT = process.env.PORT || 3000;

async function startServer() {
  await initDatabase();  // 🔥 Auto-create tables

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
