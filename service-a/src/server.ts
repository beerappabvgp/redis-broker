require("dotenv").config();
const express = require("express");
const redis = require("redis");

const app = express();
app.use(express.json());

// const redisClient = redis.createClient({
//     url: process.env.REDIS_URL || "redis://localhost:6397",
// });

const REDIS_HOST = process.env.REDIS_HOST || 'redis';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

console.log(`Attempting to connect to Redis at ${REDIS_HOST}:${REDIS_PORT}`);

const redisClient = redis.createClient({
    url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
});

redisClient.on("connect", () => {
    console.log("Service A connected to redis ... ");
});

redisClient.on("error", (err: any) => {
    console.error("redis error: ", err);
});

(async () => {
    await redisClient.connect();
})();   

// API endpoint to produce or send data 
app.post("/send", async (req: any, res: any) => {
    const { channel, message } = req.body;
    if (!channel || !message) {
        return res.status(400).send({
            error: "Channel and message are required ... "
        })
    }
    try {
        await redisClient.publish(channel, message);
        console.log("published successfully .... ")
        res.status(200).send({ 
            status: "message sent",
            channel,
            message,
        });
    } catch (error) {
        res.status(500).send({ 
            error: "Failed to send the message",
            details: error,
        });
    }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Service A is running on port ${PORT}`));