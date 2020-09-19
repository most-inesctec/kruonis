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
     * Benchmark constructor
     * 
     * @param properties This Benchmark properties used to create a properties object
     */
    constructor(properties?: object) {
        this.properties = new BenchmarkProperties(properties);
    }

    getProperties(): object {
        return this.properties.getProperties();
    }

    add(testName: string, fn: () => void): Benchmark {
        this.tests.push(new Test(testName, fn));
        return this;
    };

    run(): Array<[string, Stats]> {
        let results: Array<[string, Stats]> = [];

        for (let test of this.tests) {
            test.run(this.getProperties());
            results.push([test.name, test.getStats()]);
        }

        return results;
    };
}