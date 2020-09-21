/**
 * User changeable properties of a Benchmark
 */
export class BenchmarkProperties {

    /**
     * The minimum number of cycle runs
     */
    readonly minCycles: number = 10;

    /**
     * The maximum number of cycle  runs.
     * The algorithm always tries to run the maximum number of runs 
     */
    readonly maxCycles: number = 100;

    /**
     * The maximum time a test can run, in seconds.
     * Note that minCycles has priority over this setting.
     */
    readonly maxTime: number = 15;

    /**
     * The Benchmark name
     */
    readonly name: string = undefined;

    /**
     * BenchmarkProperties constructor
     * 
     * @param properties the new properties
     */
    constructor(properties: object) {
        //If properties is an object
        if (properties === Object(properties))
            for (let property_name of Object.keys(properties))
                // Only update properties that exist
                if (this.hasOwnProperty(property_name))
                    this[property_name] = properties[property_name];
    }
}