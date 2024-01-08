const app = require("./app");
const mongoose = require("mongoose");
const { envConfig } = require("./configs");

mongoose
  .connect(envConfig.dbHost)
  .then(() => {
    console.log("Database connection successful");
    app.listen(envConfig.port, () => {
      console.log(`Server running. Use our API on port: ${envConfig.port}`);
    });
  })
  .catch(() => {
    console.log("Connection error");
    process.exit(1);
  });
