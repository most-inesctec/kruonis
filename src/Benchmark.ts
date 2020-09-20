import { BenchmarkProperties, Test, Stats } from "./internal";

/**
 * The main class.
 * A Benchmark consists of a group of tests that are run and compared regarding the time performances.
 */
export class Benchmark {

    /**
     * This Benchmark properties
     */
    private properties: BenchmarkProperties = null;

    /**
     * The tests added by the user, to be run
     */
    private tests: Array<Test> = [];

    /**
     * The results obtained in the previous run of this benchmark.
     * Consists of a list of pairs test name - test stats
     */
    private results: Array<[string, Stats]> = [];

    /**
     * Function to run before running the tests
     */
    private onBegin: (benchmark: Benchmark) => void = (benchmark: Benchmark) => { };

    /**
     * Function to run on the end of all tests
     */
    private onEnd: (benchmark: Benchmark) => void = (benchmark: Benchmark) => { };

    /**
     * Benchmark constructor
     * 
     * @param properties This Benchmark properties used to create a properties object
     */
    constructor(properties?: object) {
        this.properties = new BenchmarkProperties(properties);
    }

    /**
     * Get the @BenchmarkProperties used in this Benchmark, as an object 
     */
    getProperties(): object {
        return this.properties.getProperties();
    }

    /**
     * Get the tests that perform on this Benchmark
     */
    getTests(): Array<Test> {
        return this.tests;
    }

    /**
     * Get the results previously obtained on this Benchmark
     * @return list of pairs test name - test stats
     */
    getResults(): Array<[string, Stats]> {
        return this.results;
    }

    /**
     * Add a new test to this Benchmark
     * 
     * @param testName the test name
     * @param fn The function to run on this test
     * @return the created @Test
     */
    add(testName: string, fn: () => void): Test {
        const newTest = new Test(testName, fn);
        this.tests.push(newTest);
        return newTest;
    };

    /**
     * Add an event to this Benchmark. Possibilities:
     *  - 'onBegin'
     *  - 'onEnd'
     * 
     * @param eventName The name of the event to be altered
     * @param fn The function that will run when the event is called
     */
    on(eventName: string, fn: (test: Benchmark) => void): Benchmark {
        if (eventName.substr(0, 2) == "on" && this.hasOwnProperty(eventName))
            this[eventName] = fn;
        return this;
    }

    /**
     * Run this Benchmark list of @Test
     * 
     * @return results obtained as a list of pairs test name - test stats
     */
    run(): Array<[string, Stats]> {
        this.onBegin(this);

        for (let test of this.tests) {
            test.run(this.getProperties());
            this.results.push([test.name, test.getStats()]);
        }

        this.onEnd(this);

        return this.results;
    };
}