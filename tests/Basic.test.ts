import { Benchmark } from '../src/internal';
import { expect } from 'chai';
import 'mocha';

describe('Basic tests', () => {

    it('Setting options', () => {
        // No options passed
        let benchmark = new Benchmark();
        expect(benchmark.getOptions()).to.be.deep.equal({ 'minRuns': 10, 'maxRuns': 100, 'maxTime': 15, 'name': undefined });

        // Passed single settings
        benchmark = new Benchmark({ 'maxRuns': 50 });
        expect(benchmark.getOptions()).to.be.deep.equal({ 'minRuns': 10, 'maxRuns': 50, 'maxTime': 15, 'name': undefined });

        // Passed several settings
        benchmark = new Benchmark({ 'maxRuns': 50, 'name': 'Benchmark' });
        expect(benchmark.getOptions()).to.be.deep.equal({ 'minRuns': 10, 'maxRuns': 50, 'maxTime': 15, 'name': 'Benchmark' });

        // Passed non-existent settings
        benchmark = new Benchmark({ 'dummy': 0 });
        expect(benchmark.getOptions()).to.be.deep.equal({ 'minRuns': 10, 'maxRuns': 100, 'maxTime': 15, 'name': undefined });
    });
});
