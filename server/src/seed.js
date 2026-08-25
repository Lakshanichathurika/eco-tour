require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Destination = require("./models/Destination");
const seedData = require("./data/destinationsSeed.json");

async function seed() {
  await connectDB();

  let count = 0;
  for (const item of seedData) {
    await Destination.findOneAndUpdate({ slug: item.slug }, item, {
      upsert: true,
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    });
    count += 1;
  }

  console.log(`Seeded ${count} destinations`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
