const Controller = require("../controllers/Controller");
const authentication = require("../middlewares/authentication");
const router = require("express").Router();

router.post("/login", Controller.login);
router.use(authentication);
router.get("/list_job", Controller.listJob);
router.get("/list_job/:id", Controller.detailsJob);
module.exports = router;
