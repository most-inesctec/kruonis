import { Benchmark, Test, Stats } from '../src/internal';
import { expect } from 'chai';
import 'mocha';

describe('Functionality Tests', () => {

    it('Setting Properties', () => {
        // No Properties passed
        let benchmark = new Benchmark();
        expect(benchmark.getProperties()).to.be.deep.equal({ 'minCycles': 10, 'maxCycles': 100, 'maxTime': 15, 'name': undefined });

        // Passed single settings
        benchmark = new Benchmark({ 'maxCycles': 50 });
        expect(benchmark.getProperties()).to.be.deep.equal({ 'minCycles': 10, 'maxCycles': 50, 'maxTime': 15, 'name': undefined });

        // Passed several settings
        benchmark = new Benchmark({ 'maxCycles': 50, 'name': 'Benchmark' });
        expect(benchmark.getProperties()).to.be.deep.equal({ 'minCycles': 10, 'maxCycles': 50, 'maxTime': 15, 'name': 'Benchmark' });

        // Passed non-existent settings
        benchmark = new Benchmark({ 'dummy': 0 });
        expect(benchmark.getProperties()).to.be.deep.equal({ 'minCycles': 10, 'maxCycles': 100, 'maxTime': 15, 'name': undefined });

        // Trying to change safe props
        benchmark = new Benchmark({ '_tests': null });
        expect(benchmark.getProperties()).to.be.deep.equal({ 'minCycles': 10, 'maxCycles': 100, 'maxTime': 15, 'name': undefined });
    });

    it('Stopping conditions', () => {
        const sleep = (milliseconds: number) => {
            const date = Date.now();
            let currentDate = null;
            do {
                currentDate = Date.now();
            } while (currentDate - date < milliseconds);
        }

        const benchmark: Benchmark = new Benchmark({ 'maxTime': 5 });
        benchmark
            .add(new Test('test1', () => { let temp = 1 + 1 }))
            .add(new Test('test2', () => sleep(600)))
            .add(new Test('test3', () => sleep(200)));

        const results: Array<[string, Stats]> = benchmark.run();
        expect(results).to.be.equal(benchmark.getResults());

        const test1_stats: Stats = results[0][1];
        const test2_stats: Stats = results[1][1];
        const test3_stats: Stats = results[2][1];

        // Completed expected cycles
        expect(test1_stats.count).to.be.equal(100);
        // Completed minimum cycles
        expect(test2_stats.count).to.be.equal(10);
        // Completed more than minimum cycles and then time expired
        expect(test3_stats.count).to.be.greaterThan(10);
        expect(test3_stats.count).to.be.lessThan(100);
    });

    it('Test onEvents', () => {
        const benchmark: Benchmark = new Benchmark();
        let startIterator: number = 0;
        let endIterator: number = 0;
        let start: boolean = false;
        let end: number = 0;

        benchmark.add(
            new Test('test', () => { })
                .on('onBegin', (_: Test) => start = true)
                .on('onCycleBegin', (_: Test) => startIterator++)
                .on('onCycleEnd', (_: Test) => endIterator--)
                .on('onEnd', (test: Test) => end = test.getStats().count * 2))
            .run();

        expect(start).to.be.true;
        expect(startIterator).to.be.equal(100);
        expect(endIterator).to.be.equal(-100);
        expect(end).to.be.equal(200);
    });

    it('Test stats', () => {
        const mockCycleTimes = [10, 12, 8, 16, 18, 6, 10, 10, 12, 12];
        const mockStats = new Stats(mockCycleTimes);
        expect(mockStats.mean).to.be.equal(11.4);
        expect(mockStats.std).to.be.equal(3.352610922848042);
        expect(mockStats.count).to.be.equal(10);
        expect(mockStats.max).to.be.equal(18);
        expect(mockStats.min).to.be.equal(6);
    });

    it('Benchmark onEvents', () => {
        const benchmark: Benchmark = new Benchmark({ 'name': 'Benchmark' });
        let start: number = 0;
        let startTest: string = '';
        let endTest: number = 0;
        let end: string = '';

        // Adding Tests
        benchmark
            .add(new Test('test1', () => { }))
            .add(new Test('test2', () => { let _ = 1 + 1; }));

        // Adding Events to Benchmark
        benchmark.on('onBegin', (benchmark: Benchmark) => {
            start = benchmark.getTests().length;
        });
        benchmark.on('onTestBegin', (benchmark: Benchmark, test: Test) => {
            startTest = benchmark.getProperties().name;
        });
        benchmark.on('onTestEnd', (benchmark: Benchmark, test: Test) => {
            endTest += test.getStats().count;
        });
        benchmark.on('onEnd', (benchmark: Benchmark) => {
            end = benchmark.getTests()[1].name;
        });

        benchmark.run();

        expect(start).to.be.equal(2);
        expect(startTest).to.be.equal('Benchmark');
        expect(endTest).to.be.equal(200);
        expect(end).to.be.equal('test2');
    });

    it('Baseline time', () => {
        const benchmark: Benchmark = new Benchmark();
        const results: Array<[string, Stats]> =
            benchmark
                .add(new Test('testZero', () => { }))
                .add(new Test('testCloseToZero', () => {
                    let t: number = 1 + 1;
                    t += 3 * t;
                }))
                .add(new Test('testNotZero', () => {
                    const array: number[] = [1, 2, 3];
                    for (let i in array)
                        array[i] *= array[i];
                }))
                .run();

        //First test, since empty, should be very close to zero
        expect(results[0][1].mean).to.not.be.greaterThan(0.001);
        expect(results[1][1].mean).to.be.greaterThan(results[0][1].mean);
        expect(results[2][1].mean).to.be.greaterThan(results[1][1].mean);
    });
});
