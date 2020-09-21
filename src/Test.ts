import { Stats } from "./internal";

const now = require("performance-now");

/**
 * A test represents a code that shall be run and afterwards compared regarding the performance
 */
export class Test {

    private static readonly SECONDS_TO_MILLISECONDS = 1000;

    /**
     * The measured times for the ran cycles, in milliseconds
     */
    private cycleTimes: Array<number> = [];

    /**
     * The stats obtained by running this test
     */
    private stats: Stats = null;

    /**
     * Function to run on the begin of the test
     */
    private onBegin: (test: Test) => void = (test: Test) => { };

    /**
     * Function to run after before running each cycle
     */
    private onCycleBegin: (test: Test) => void = (test: Test) => { };

    /**
     * Function to run after each cycle completes
     */
    private onCycleEnd: (test: Test) => void = (test: Test) => { };

    /**
     * Function to run on the end of all test cycles
     */
    private onEnd: (test: Test) => void = (test: Test) => { };

    /**
     * @param name The test name
     * @param fn The function to be run
     */
    constructor(readonly name: string, private fn: () => void) { }

    /**
     * Add an event to this Test. Possibilities:
     *  - 'onBegin'
     *  - 'onCycle'
     *  - 'onEnd'
     * 
     * @param eventName The name of the event to be altered
     * @param fn The function that will run when the event is called
     */
    on(eventName: string, fn: (test: Test) => void): Test {
        if (eventName.substr(0, 2) == "on" && this.hasOwnProperty(eventName))
            this[eventName] = fn;
        return this;
    }

    /**
     * Gets the test baseline time (the time it takes to measure the times)
     */
    private getBaselineTime(): number {
        const startTime = now();
        const endTime = now();
        return endTime - startTime;
    }

    /**
     * Run this test according to the given testProperties
     * 
     * @param testProperties the testProperties to use on this test. Similar to a @BenchmarkProperties object
     */
    run(testProperties: any): void {
        // Times are measured in milliseconds
        let totalTime = 0;
        const { minCycles, maxCycles, maxTime } = testProperties;
        const maxTimeMS = maxTime * Test.SECONDS_TO_MILLISECONDS;
        const baselineTime: number = this.getBaselineTime();

        this.onBegin(this);

        while (this.cycleTimes.length < minCycles ||
            (totalTime < maxTimeMS && this.cycleTimes.length < maxCycles)) {

            this.onCycleBegin(this);

            // Measure performance
            const startTime = now();
            this.fn();
            const endTime = now();

            // Remove baseline times from performance testing
            let testTime = (endTime - startTime - baselineTime);
            // Because of small deviations
            testTime = testTime < 0 ? 0 : testTime;

            // Save times
            this.cycleTimes.push(testTime);
            totalTime += testTime;

            this.onCycleEnd(this);
        }

        this.stats = new Stats(this.cycleTimes);

        this.onEnd(this);
    };

    /**
     * Get the stats obtained by running this test
     * 
     * @return @Stats instance
     */
    getStats(): Stats {
        return this.stats;
    }
}