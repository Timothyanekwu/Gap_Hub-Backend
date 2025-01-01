const { createClient } = require("redis");
class RedisClient {
  constructor() {
    this.client = createClient();
    this.isConnected = false;

    this.client.on("connect", () => {
      this.isConnected = true;
      console.log("Redis connected successfully!");
    });

    this.client.on("error", (error) => {
      // console.error(`Redis connection error: ${error.message}`);
      this.isConnected = false;
    });
  }

  async connect() {
    if (!this.isConnected) {
      try {
        await this.client.connect();
        this.isConnected = true;
      } catch (error) {
        console.error("Error connecting to Redis:", error);
      }
    }
  }

  isAlive() {
    return this.isConnected;
  }

  async get(key) {
    return this.client.get(key);
  }

  async set(key, value, duration) {
    return this.client.setEx(key, duration, value);
  }

  async del(key) {
    return this.client.del(key);
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
