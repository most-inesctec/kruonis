import { Stat } from './internal';

export class Minimum implements Stat {

    calculate(values: Array<number>): number {
        return Math.min(...values);
    }
}