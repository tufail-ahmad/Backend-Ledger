const app = require("./src/app");
const connectDB = require("./src/configs/db");

connectDB();

app.listen(3000, () => {
  console.log("Server is running on port http://localhost:3000");
});
