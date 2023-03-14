// import app
const app = require("./server");

// dotenv
require("dotenv").config();

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server is running on ${port}...`));
