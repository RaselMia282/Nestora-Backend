import app from "./app.js";
import { transporter } from "./lib/nodemailer.js";
import { redisClient } from "./lib/redis.js";

const PORT = process.env.PORT || 8000;
async function main() {
  try {
    app.listen(PORT, () => {
      console.log(`Assignment 6 is running ${PORT}`);
    });
    await redisClient.connect();
    console.log("Redis connected successfully");
    await transporter.verify();
    console.log("Nodemailer connected successfully");
  } catch (error) {
    console.log(error);
  }
}
main();
