import { Benchmark } from '../src/internal';
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
        const sleep = (milliseconds) => {
            const date = Date.now();
            let currentDate = null;
            do {
                currentDate = Date.now();
            } while (currentDate - date < milliseconds);
        }

        const benchmark = new Benchmark({ 'maxTime': 5 });
        benchmark
            .add('test1', () => { let temp = 1 + 1 })
            .add('test2', () => sleep(600))
            .add('test3', () => sleep(200));
        const results = benchmark.run();
        const test1_stats = results[0][1];
        const test2_stats = results[1][1];
        const test3_stats = results[2][1];

        // Completed expected cycles
        expect(test1_stats.count).to.be.equal(100);
        // Completed minimum cycles
        expect(test2_stats.count).to.be.equal(10);
        // Completed more than minimum cycles and then time expired
        expect(test3_stats.count).to.be.greaterThan(10);
        expect(test3_stats.count).to.be.lessThan(100);
    });
});
