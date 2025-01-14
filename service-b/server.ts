require("dotenv").config();

const express = require("express");
const redis = require("redis");

const app = express();
app.use(express.json());

const redisClient = redis.createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("connect", () => {
    console.log("Service B connected to the redis server ... ");
});

redisClient.on("error", (err) => {
    console.log("Redis error: ", err);
});

(async () => {
    await redisClient.connect();
})();

const redisSubscriber = redisClient.duplicate();
redisSubscriber.on("connect", () => {
    console.log("Service B Subscriber connected to redis ... ");
});

redisSubscriber.on("error", (err) => {
    console.log("Redis Subscriber error: ", err);
});

(async () => { 
    await redisSubscriber.connect();
    const channel = process.env.REDIS_CHANNEL || "default";
    await redisSubscriber.subscribe(channel, (message) => {
        console.log(`Received message: ${message} on channel: ${channel}`);
    });
})();


const PORT = process.env.PORT || 3002;

app.listen(PORT, () => console.log(`Service B is running on port ${PORT}`));