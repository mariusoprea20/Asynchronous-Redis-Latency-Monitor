import { createClient } from 'redis';

//create clients
const publisher = createClient();
const subscriber = createClient();

//mock redis
jest.mock('redis', () => ({
    createClient: jest.fn(() => ({
        connect: jest.fn().mockResolvedValue(true),
        publish: jest.fn().mockResolvedValue(true),
    })),
}));
//describe suite
describe('Redis Handlers', () => {
    //before all connect and subscribe to redis
    beforeAll(async () => {
        await publisher.connect();
        await subscriber.connect();
    });
    //publish message
    const publishMessage = async (message: string) => {
        await publisher.publish('latency-test', message);
    };
    //describe test
    it('should publish a message to the Redis channel', async () => {
        await expect(publishMessage('test-message')).resolves.toBeUndefined();
    });
});
