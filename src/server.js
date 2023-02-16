const router = require("./app/routes/route");
const bodyParser = require("body-parser");
const express = require("express");
const swaggerUi = require("swagger-ui-express"),
swaggerDocument = require("../swagger.json");
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api", router);

app.get("/", (req, res) => {
  res.send("Hello World! 👋");
});

app.use(
  '/api-docs',
  swaggerUi.serve, 
  swaggerUi.setup(swaggerDocument)
);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

