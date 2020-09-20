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
        benchmark.add('test1', () => { let temp = 1 + 1 });
        benchmark.add('test2', () => sleep(600));
        benchmark.add('test3', () => sleep(200));
        const results: Array<[string, Stats]> = benchmark.run();
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

    it('*on* Test Events', () => {
        const benchmark: Benchmark = new Benchmark();
        let iterator: number = 0;
        let start: boolean = false;
        let end: number = 0;

        const test: Test = benchmark.add('test', () => { });
        test.on('onBegin', (_: Test) => start = true);
        test.on('onCycle', (_: Test) => iterator++);
        test.on('onEnd', (test: Test) => end = test.getStats().count * 2);
        benchmark.run();

        expect(start).to.be.true;
        expect(iterator).to.be.equal(100);
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
});
