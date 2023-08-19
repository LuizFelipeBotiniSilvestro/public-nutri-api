const express = require("express");
const router = express();
const swaggerUi = require("swagger-ui-express");

const swaggerFile = require("./swagger.json");

router.use("/api/users", require("./UserRoutes"));
router.use("/api/photos", require("./PhotoRoutes"));
router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

module.exports = router;
