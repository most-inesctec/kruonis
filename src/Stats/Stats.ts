import { Mean, StandardDeviation as Std, Count, Maximum as Max, Minimum as Min } from './internal';

/**
 * The stats resultant of running a test
 */
export class Stats {

    readonly mean: number;

    readonly std: number;

    readonly count: number;

    readonly max: number;

    readonly min: number;

    /**
     * Constructor
     * 
     * @param cycleTimes list of obtained performance times of each cycle
     */
    constructor(cycleTimes: Array<number>) {
        this.mean = new Mean().calculate(cycleTimes);
        this.std = new Std().calculate(cycleTimes);
        this.count = new Count().calculate(cycleTimes);
        this.max = new Max().calculate(cycleTimes);
        this.min = new Min().calculate(cycleTimes);
    }

}