/**
 * User changeable properties of a Benchmark
 */
export class BenchmarkProperties {

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

    /**
     * Get this object properties
     */
    getProperties(): object {
        const properties = {}

        for (let property_name of Object.keys(this))
            properties[property_name] = this[property_name];

        return properties;
    }
}