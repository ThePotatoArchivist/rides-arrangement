// Data models to describe arrangements
// Way to specify criteria
// Way to build a reward function from that
// Procedure to optimize

import { bruteForce } from "./algorithms.js";
import { GroupingCriteria } from "./criteria.js";
import { max } from "./iterators.js";
import { ArrangementInput, occupantsOf, Person } from "./model.js";

function transposeUneven<T>(table: T[][], defaultValue: T): T[][] {
    return [...Array(table[Symbol.iterator]().map(row => row.length).reduce(max)).keys().map(column => table.map(row => row[column] ?? defaultValue))]
}

function csv(table: unknown[][]) {
    return table.map(e => e.join(',')).join('\n')
}

function tabulate(table: string[][]) {
    const widths = table[0].map((_, column) => table.map(row => row[column].length).reduce(max))
    return table.map(row => row.map((value, column) => value.padEnd(widths[column], ' ')).join('  ')).join('\n')
}


// Test!

const input: ArrangementInput = {
    drivers: [
        {name: 'driver0', capacity: 2},
        {name: 'driver1', capacity: 3},
    ],
    passengers: [
        {name: 'passenger0', capacity: 0},
        {name: 'passenger1', capacity: 0},
        {name: 'passenger2', capacity: 0},
        {name: 'passenger3', capacity: 0},
        {name: 'passenger4', capacity: 0},
    ]
}

const grouping = new Map<Person, 'VDC' | 'Flagpoles'>([
    [input.drivers[0], 'VDC'],
    [input.drivers[1], 'Flagpoles'],
    [input.passengers[0], 'VDC'],
    [input.passengers[1], 'Flagpoles'],
    [input.passengers[2], 'Flagpoles'],
    [input.passengers[3], 'VDC'],
    [input.passengers[4], 'Flagpoles'],
])

const result = bruteForce(input, new GroupingCriteria(person => grouping.get(person)!))
console.log(tabulate(transposeUneven(result.map(car => [...occupantsOf(car).map(person => person.name)]), '')))