# :hourglass: kruonis :hourglass:

[![BCH compliance](https://bettercodehub.com/edge/badge/most-inesctec/kruonis?branch=master)](https://bettercodehub.com/)
[![Build Status](https://travis-ci.com/most-inesctec/kruonis.svg?token=J52cxsfW92GANe4gUJgy&branch=master)](https://travis-ci.com/most-inesctec/kruonis)
[![Coverage Status](https://coveralls.io/repos/github/most-inesctec/kruonis/badge.svg?branch=master)](https://coveralls.io/github/most-inesctec/kruonis?branch=master)

A tool to perform benchmarks on _TypeScript_.

The tool name deviates from the name of the Lithuanian goddess of time, ___Kruonis___, as essentially the tool measures the time it takes for code to run.

Essentially, a __benchmark__ consists of a set of tests.
When running a benchmark, each __test__ is run several times (test __cycles__) and the performance is compared using the statistics of the several ran cycles.

To measure the performances, _kruonis_ employs the [performance-now](https://www.npmjs.com/package/performance-now) package.


## Usage example

First, import _kruonis_ main classes:

```TypeScript
import { Benchmark, Test } from "kruonis";
```

Then, lets create a benchmark:

```TypeScript
let benchmark = new Benchmark();
```

Additionally, _kruonis_ lets you pass your benchmark properties as an object to the constructor, such as: 

```TypeScript
benchmark = new Benchmark({ 'maxCycles': 50, 'name': 'Benchmark', 'maxTime': 15 });
```

The possible properties are available [here](https://github.com/most-inesctec/kruonis/blob/master/src/BenchmarkProperties.ts).

We can also define events for the benchmark class, such as:
```TypeScript
benchmark
    .on('onBegin', (benchmark: Benchmark) => {
        // Code to run on the beginning of this benchmark
        // Example:
        console.log("Beginning of the benchmark")
    })
    .on('onTestBegin', (benchmark: Benchmark, test: Test) => {
        // Code to run on the end of the benchmark (on the end of all tests)
        // Example:
        console.log("Running test: " + test.name)
    })
    .on('onTestEnd', (benchmark: Benchmark) => {
        // Code to run on the end of the benchmark (on the end of all tests)
        // Example:
        console.log("The stats of the test that just ran are: " + test.getStats())
    })
    .on('onEnd', (benchmark: Benchmark) => {
        // Code to run on the end of the benchmark (on the end of all tests)
        // Example:
        console.log("Ended benchmark")
    });
```

A benchmark consists of a set of tests. Therefore, we can add tests to a benchmark. Each `Test` can also take events. For example:

```TypeScript
// Example object for test
let testArray: number[];

benchmark
    .add(
        new Test('exampleTest1', () => {
            // Measure code performance of what goes here
            // Example:
            for (let i = 0; i < testArray.length; ++i)
                testArray[i] *= testArray[i];
        })
        .on('onBegin', (test: Test) => {
            // Code to execute on before starting the cycle loop
            // Example:
            testArray = [1, 2, 3, 4, 5, 6];
        })
        .on('onCycleBegin', (test: Test) => {
            // Code to execute before each cycle
            // Example:
            console.log("Starting cycle");
        })
        .on('onCycleEnd', (test: Test) => {
            // Code to execute after each cycle ran
            // Example:
            testArray = [1, 2, 3, 4, 5, 6];
        })
        .on('onEnd', (test: Test) => {
            // Test to execute after all cycles
            // The Stats object with the cycle performances is now populated
            // Example:
            console.log("Finished running all cycles");
        })
    )
    .add(
        // Add another test ...
    );
```

After adding all tests, we can then run them using:
```TypeScript
benchmark.run();
```

After running the benchmark we can obtain the statistics of each ran test in several ways:
1. Using the return array of the `behcnmark.run()` method. Example:
```TypeScript
const results: Array<[string, Stats]> = benchmark.run();
for(let result of results) {
    console.log("Test name: " + result[0]);
    console.log("Test stats: " + result[1]);
}
```
2. Adding an event listener of the `onTestEnd` event to the benchmark.
```TypeScript
benchmark.on('onTestEnd', (benchmark: Benchmark, test: Test) => {
    console.log("Test name: " + test.name);
    console.log("Test stats: " + test.getStats());
}). run();
```
3. Adding an event listener of the `onEnd` event to the benchmark.
```TypeScript
benchmark.on('onEnd', (benchmark: Benchmark) => {
    for(let result of benchmark.getResults()) {
        console.log("Test name: " + result[0]);
        console.log("Test stats: " + result[1]);
    }
}). run();
```
4. Adding an identical event listener to all tests' `onEnd` events.
```TypeScript
benchmark
    .add(
        new Test('exampleTest1', () => {
            // Code
        })
        .on('onEnd', (test: Test) => {
            console.log("Test name: " + test.name);
            console.log("Test stats: " + test.getStats());
        })
    .add(
        // Similar for other tests
    ).run();
}
```

The Statistics outputted can be consulted [here](https://github.com/most-inesctec/kruonis/blob/master/src/Stats/Stats.ts). An example of a Stats object is:
```TypeScript
{
    // The mean run time of the test
    'mean': 11.4,
    // The standard deviation
    'std': 3.352610922848042,
    // The number of ran cycles
    'count': 10,
    // The maximum time it took to run the test code
    'max': 18,
    // The maximum time it took to run the test code
    'min': 6
}
```

## How does it work?

The logic behind the `benchmark.run()` method (and the order in which the events are run) is:
```python
# Benchmark scope
Benchmark.onBegin()

for each test of tests:
    Benchmark.onTestBegin()

    # Test scope
    test.onBegin()

    while(number of cycles < minCycles and
          spent time on ran cycles < maxTime and
          number of ran cycles < maxCycles)

        # Cycle scope
        test.onCycleBegin()

        runTestCode()

        test.onCycleEnd()

    test.onEnd()
    # Ended test

    Benchmark.onTestEnd()

Benchmark.onEnd()
```