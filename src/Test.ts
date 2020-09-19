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
     * Function to run on the begin of the test cycle
     */
    private onBegin: (test: Test) => void = (test: Test) => { };

    /**
     * Function to run after each cycle completes
     */
    private onCycle: (test: Test) => void = (test: Test) => { };

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

    run(testProperties: any): void {
        // Times are measured in milliseconds
        let totalTime = 0;
        const { minCycles, maxCycles, maxTime } = testProperties;
        const maxTimeMS = maxTime * Test.SECONDS_TO_MILLISECONDS;

        this.onBegin(this);

        while (true) {
            // Stop conditions
            if (this.cycleTimes.length >= minCycles) {
                if (totalTime >= maxTimeMS)
                    break;
                if (this.cycleTimes.length >= maxCycles)
                    break;
            }

            // Measure performance
            let startTime = now();
            this.fn();
            let endTime = now();

            // Save times
            this.cycleTimes.push(endTime - startTime);
            totalTime += endTime - startTime;

            this.onCycle(this);
        }

        this.stats = new Stats(this.cycleTimes);

        this.onEnd(this);
    };

    getStats(): Stats {
        return this.stats;
    }
}