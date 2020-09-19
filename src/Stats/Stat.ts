/**
 * A generic stat to be obtained from a list of values
 */
export interface Stat {

    /**
     * Calculate the given stat from a list of values
     */
    calculate(values: Array<number>): number;
}