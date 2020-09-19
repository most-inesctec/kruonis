import { Stat } from './internal';

export class Maximum implements Stat {

    calculate(values: Array<number>): number {
        return Math.max(...values);
    }
}