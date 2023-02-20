const express = require("express");

const router = express.Router();

router.get("/", async (req, res, next) => {
  res.status(200);
});

router.get("/:contactId", async (req, res, next) => {
  res.status(200);
});

router.post("/", async (req, res, next) => {
  res.status(201);
});

router.delete("/:contactId", async (req, res, next) => {
  res.status(404);
});

router.put("/:contactId", async (req, res, next) => {
  res.status(200);
});

module.exports = router;
