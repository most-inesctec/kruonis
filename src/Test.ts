const now = require("performance-now");


/**
 * A test represents a code that shall be run and afterwards compared regarding the performance
 */
export class Test {

    /**
     * The measured times for the ran cycles
     */
    private runTimes: Array<number> = null;

    /**
     * The stats obtained by running this test
     */
    private Stats = null;

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
    constructor(private name: string, private fn: () => void) { }

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

    run(): void {
        let startTime = now();
        let endTime = now();

        console.log((endTime - startTime).toFixed(3) + " ms");
    };
}