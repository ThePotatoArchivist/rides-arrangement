// Data models to describe arrangements
// Way to specify criteria
// Way to build a reward function from that
// Procedure to optimize

import * as algorithms from "./algorithms.js";
import { compileObjective, GroupingCriterion } from "./criteria.js";
import { associateWith, max } from "./iterators.js";
import { ArrangementInput, occupantsOf } from "./model.js";
import parseCsv from 'neat-csv'
import fs from 'fs'
import { range } from './counting.js';

function transposeUneven<T>(table: T[][], defaultValue: T): T[][] {
    return range(table.values().map(row => row.length).reduce(max)).map(column => table.map(row => row[column] ?? defaultValue)).toArray()
}

function tabulate(table: string[][]) {
    const widths = table[0].values().map((_, column) => table.map(row => row[column].length).reduce(max)).toArray()
    return table.map(row => row.map((value, column) => value.padEnd(widths[column], ' ')).join('  ')).join('\n')
}

interface Person {
    name: string
    // phone: number
    /**
     * 0 means needs a ride
     * 1 means can drive self
     * 2+ means can drive self & others
     */
    capacity: number
    location: string
    locationGroup: string
}

type RawPerson = Record<keyof Person, string>

const people = (await parseCsv<RawPerson>(fs.readFileSync('input.csv')))
    .map<Person>(raw => ({...raw, capacity: parseInt(raw.capacity)}))


// Test!

const input: ArrangementInput<Person> = {
    drivers: people.filter(e => e.capacity > 0).reduce(associateWith(e => e.capacity - 1), new Map()),
    passengers: people.filter(e => e.capacity === 0),
}

const objective = compileObjective([
    [new GroupingCriterion(input, person => person.location), 1, true],
    [new GroupingCriterion(input, person => person.locationGroup), 2, true],
])
const result = algorithms.repeated(100, algorithms.sloping)(input, objective)
console.log(tabulate(transposeUneven(result.map(car => [...occupantsOf(car).map(person => person.name)]), '')))