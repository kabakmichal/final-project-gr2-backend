
const app = require("./src/app");
const dotenv = require("dotenv");
dotenv.config();

app.listen(process.env.PORT, () => {
  console.log(`Server running. Use our API on port: ${process.env.PORT}`);
});

