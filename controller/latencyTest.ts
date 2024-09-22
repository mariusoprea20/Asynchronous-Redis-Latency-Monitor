import { createClient } from "redis";

const publisher = createClient();
const subscriber = createClient();
let latencies: number[] = [];

export const runRedisClients = async () => {
    try {
        await publisher.connect();
        await subscriber.connect();
        console.log("Connected to Redis");

        subscriber.subscribe(`latency-test`, (message: string) => {
            const receivedTime = Date.now();
            const sentTime = new Date(message).getTime();
            const latency = receivedTime - sentTime;
            console.log('Latency:', latency, 'ms');
            latencies.push(latency);
            //removes first element in array if length = 6
            if (latencies.length > 5) latencies.shift();
        });

        setInterval(() => {
            const currentDateTime = new Date().toISOString();
            publisher.publish(`latency-test`, currentDateTime);
            console.log('Published:', currentDateTime);
        }, 1000);

        setInterval(async () => {
            await calculateMeanLatency(latencies);
            console.log("Average latency time is being processed...");
        }, 3000);

    } catch (err) {
        console.error(err);
    }
};

export const calculateMeanLatency = async (latencies: number[]) => {
    if (latencies.length === 0) return;
    const sum = latencies.reduce((acc, latency) => acc + latency, 0);
    const mean = sum / latencies.length;
    console.log(`Mean latency for ${latencies.length} measurements is ${mean} ms`);
};
