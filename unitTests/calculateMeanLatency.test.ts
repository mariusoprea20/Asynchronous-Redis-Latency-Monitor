import { calculateMeanLatency } from '../controller/latencyTest';

//describe suite
describe('calculateMeanLatency', () => {
    afterEach(jest.clearAllMocks);
    it('should correctly calculate the mean latency', async () => {
        const latencies = [100, 200, 300, 400, 500]; // 5 latencies
        console.log = jest.fn(); // mocking console

        await calculateMeanLatency(latencies);

        expect(console.log).toHaveBeenCalledWith('Mean latency for 5 measurements is 300 ms');
    });

    //describe test
    it('should handle an empty array of latencies without errors', async () => {
        const latencies: number[] = [];
        console.log = jest.fn(); // mocking console

        await calculateMeanLatency(latencies);

        //no logging should happen if there sis no latency
        expect(console.log).not.toHaveBeenCalled();
    });
});
