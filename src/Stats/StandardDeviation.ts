import { Stat } from './internal';

export class StandardDeviation implements Stat {

    calculate(values: Array<number>): number {
        const N = values.length;
        const mean = values.reduce((acc: number, val: number) => acc + val, 0) / N;

        return Math.sqrt(
            values.reduce((acc: number, val: number) => acc + Math.pow(val - mean, 2), 0) / N);
    }
}