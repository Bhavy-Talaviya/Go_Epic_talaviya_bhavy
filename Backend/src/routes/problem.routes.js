const express = require("express");

const router = express.Router();

const {
  getAllProblems,
  getSingleProblem,
  createProblem,
  replaceProblem,
  updateProblem,
  deleteProblem,
  searchProblems,
  getProblemsByTopic,
  getProblemsByDifficulty,
  getProblemsBySource,
  getProblemsByInstructionKeyword,
  getRandomProblem,
  getTrendingProblems,
  getRecentProblems,
  getAdvancedProblems,
  importProblems,
} = require("../controllers/problem.controller");

const validateProblem = require("../middleware/validateProblem.middleware");

const {
  generalLimiter,
  searchLimiter,
  createProblemLimiter,
  bulkUploadLimiter,
} = require("../middleware/rateLimit.middleware");

router.get("/", generalLimiter, getAllProblems);

router.get("/search", searchLimiter, searchProblems);

router.get("/topic/:topic", getProblemsByTopic);

router.get("/difficulty/:difficulty", getProblemsByDifficulty);

router.get("/source/:source", getProblemsBySource);

router.get("/instruction/:keyword", getProblemsByInstructionKeyword);

router.get("/random", getRandomProblem);

router.get("/trending", getTrendingProblems);

router.get("/recent", getRecentProblems);

router.get("/advanced", getAdvancedProblems);

router.get("/:problemId", getSingleProblem);

router.post("/import-json", bulkUploadLimiter, importProblems);

router.post("/", createProblemLimiter, validateProblem, createProblem);

router.put("/:problemId", validateProblem, replaceProblem);

router.patch("/:problemId", updateProblem);

router.delete("/:problemId", deleteProblem);

module.exports = router;