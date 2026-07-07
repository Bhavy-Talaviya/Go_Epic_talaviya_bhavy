const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const Problem = require("../models/problem.model");
const Solution = require("../models/solution.model");
const User = require("../models/user.model");
const Topic = require("../models/topic.model");
const Dataset = require("../models/dataset.model");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/go-epic";

const seedDB = async () => {
  try {
    console.log("Connecting to database at:", MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log("Database connected successfully.");

    // Clean existing data
    console.log("Cleaning existing database collections...");
    await Promise.all([
      Problem.deleteMany({}), // Cleans 'dataset' collection
      User.deleteMany({}),
      Topic.deleteMany({}),
      Dataset.deleteMany({}),
    ]);
    console.log("Existing collections cleared.");

    // Seed Users
    console.log("Seeding users...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    const users = await User.insertMany([
      {
        name: "Admin User",
        email: "admin@gmail.com",
        password: hashedPassword,
        role: "admin",
      },
      {
        name: "Demo User",
        email: "demo@gmail.com",
        password: hashedPassword,
        role: "user",
      },
    ]);
    console.log(`Seeded ${users.length} users (1 Admin, 1 Regular User).`);

    // Load and seed Problems / Solutions
    const dataPath = path.join(__dirname, "../../data/go-epic.json");
    if (fs.existsSync(dataPath)) {
      const rawData = fs.readFileSync(dataPath, "utf-8");
      const problemsData = JSON.parse(rawData);

      const problemsToInsert = problemsData.map((item, index) => ({
        instruction: item.instruction,
        topic: item.topic || "General",
        difficulty: item.difficulty || "medium",
        output: item.output || "",
        dataset_source: item.source || item.dataset_source || "go-epic",
        problem_number: index + 1,
        url: item.url || `https://leetcode.com/problems/mock-${index + 1}`,
        views: Math.floor(Math.random() * 100) + 1,
      }));

      const inserted = await Problem.insertMany(problemsToInsert);
      console.log(`Seeded ${inserted.length} problems into 'dataset' collection.`);

      // Seed Topics (derived dynamically from problems)
      console.log("Seeding topics...");
      const uniqueTopics = [...new Set(problemsToInsert.map((p) => p.topic))];
      const topicsToInsert = uniqueTopics.map((topicName) => ({
        name: topicName,
        category: "programming",
        description: `${topicName} coding challenges and algorithmic problems.`,
        views: Math.floor(Math.random() * 200) + 50,
      }));
      await Topic.insertMany(topicsToInsert);
      console.log(`Seeded ${topicsToInsert.length} topics.`);

      // Seed Datasets (derived dynamically from problems with difficulty normalization)
      console.log("Seeding datasets...");
      const normalizeDifficulty = (diff) => {
        const d = (diff || "").toLowerCase();
        if (d === "easy" || d === "beginner") return "easy";
        if (d === "medium" || d === "intermediate") return "medium";
        if (d === "advanced" || d === "hard" || d === "difficult") return "advanced";
        return "medium";
      };

      const datasetGroups = {};
      problemsToInsert.forEach((p) => {
        const normalizedDiff = normalizeDifficulty(p.difficulty);
        const key = `${p.dataset_source}::${p.topic}::${normalizedDiff}`;
        if (!datasetGroups[key]) {
          datasetGroups[key] = {
            source: p.dataset_source,
            topic: p.topic,
            difficulty: normalizedDiff,
            totalProblems: 0,
            description: `${p.dataset_source} dataset for ${p.topic} (${normalizedDiff})`,
          };
        }
        datasetGroups[key].totalProblems++;
      });

      const datasetsToInsert = Object.values(datasetGroups);
      await Dataset.insertMany(datasetsToInsert);
      console.log(`Seeded ${datasetsToInsert.length} datasets.`);
    } else {
      console.warn("Seed file data/go-epic.json not found. Skipping problems seed.");
    }

    console.log("Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();
