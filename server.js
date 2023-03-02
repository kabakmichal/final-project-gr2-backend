const api = require("./api");
const dotenv = require("dotenv");
dotenv.config();

api.listen(process.env.PORT, () => {
  console.log(`Server running. Use our API on port: ${process.env.PORT}`);
});
