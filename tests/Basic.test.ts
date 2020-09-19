import { Benchmark } from '../src/internal';
import { expect } from 'chai';
import 'mocha';

describe('Basic tests', () => {

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

    it('Creating Tests', () => {
        const benchmark = new Benchmark();
        benchmark.add('test', () => {});
        benchmark.run();

    });
});
