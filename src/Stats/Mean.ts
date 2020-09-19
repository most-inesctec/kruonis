import { Stat } from './internal';

export class Mean implements Stat {

    calculate(values: Array<number>): number {
        return values.reduce((acc: number, val: number) => acc + val, 0) / values.length;
    }
}