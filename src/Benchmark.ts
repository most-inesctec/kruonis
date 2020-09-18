import { Test } from "./Test";

/**
 * The main class.
 * A Benchmark consists of a group of tests that are run and compared regarding the time performances.
 */
export class Benchmark {

    /* Benchmark properties */

    /**
     * The minimum number of cycle runs
     */
    private minRuns: number = 10;

    /**
     * The maximum number of cycle  runs.
     * The algorithm always tries to run the maximum number of runs 
     */
    private maxRuns: number = 100;

    /**
     * The maximum time a test can run, in seconds.
     * Note that minRuns has priority over this setting.
     */
    private maxTime: number = 15;

    /**
     * The Benchmark name
     */
    private name: string = undefined;

    constructor(options?: object) {
        //If options is an object
        if (options === Object(options))
            for (let option_name of Object.keys(options))
                // Only update properties that exist
                if (this.hasOwnProperty(option_name))
                    this[option_name] = options[option_name];
    }

    getOptions(): object {
        const options = {}

        for (let option_name of Object.keys(this))
            options[option_name] = this[option_name];

        return options;
    }

    add(testName: string, fn: () => void): Test {
        return new Test(testName, fn);
    };

    run(): void { };
}