// Data models to describe arrangements
// Way to specify criteria
// Way to build a reward function from that
// Procedure to optimize

import { bruteForce } from "./algorithms.js";
import { compileObjective, GroupingCriteria } from "./criteria.js";
import { distinct, max } from "./iterators.js";
import { ArrangementInput, occupantsOf, Person } from "./model.js";

function transposeUneven<T>(table: T[][], defaultValue: T): T[][] {
    return Array(table.values().map(row => row.length).reduce(max)).keys().map(column => table.map(row => row[column] ?? defaultValue)).toArray()
}

function tabulate(table: string[][]) {
    const widths = table[0].values().map((_, column) => table.map(row => row[column].length).reduce(max)).toArray()
    return table.map(row => row.map((value, column) => value.padEnd(widths[column], ' ')).join('  ')).join('\n')
}

import parseCsv from 'neat-csv'
import fs from 'fs'

const csvInput = await parseCsv(fs.readFileSync('input.csv')) as {name: string, capacity: string, location: string}[]

const people = csvInput.map(({name, capacity, location}) => ({name, capacity: parseInt(capacity), location}))


// Test!

const input: ArrangementInput = {
    drivers: people.filter(e => e.capacity > 0),
    passengers: people.filter(e => e.capacity == 0),
}

const result = bruteForce(input, compileObjective([[new GroupingCriteria(input, person => (person as any).location), 1, true]]))
console.log(tabulate(transposeUneven(result.map(car => [...occupantsOf(car).map(person => person.name)]), '')))