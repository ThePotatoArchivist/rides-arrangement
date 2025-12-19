// Data models to describe arrangements
// Way to specify criteria
// Way to build a reward function from that
// Procedure to optimize

import { GroupingCriterion } from "./criteria.js";
import { associateWith, max, range, sum } from "./util/iterators.js";
import { ArrangementInput, occupantsOf } from "./data/model.js";
import parseCsv from 'neat-csv'
import fs from 'fs'
import { createObjective, ConfiguredCriterion } from './data/objective.js';
import { localSearch } from './algorithms/localSearch.js';
import { greedySearch } from './algorithms/greedySearch.js';
import { variations } from './algorithms/variations.js';
import { best } from './algorithms/best.js';
import { random } from './algorithms/random.js';
import { allArrangements } from './algorithms/allArrangements.js';

// Utils

function transposeUneven<T>(table: T[][], defaultValue: T): T[][] {
    return range(table.values().map(row => row.length).reduce(max)).map(column => table.map(row => row[column] ?? defaultValue)).toArray()
}

function tabulate(table: string[][]) {
    const widths = table[0].values().map((_, column) => table.map(row => row[column].length).reduce(max)).toArray()
    return table.map(row => row.map((value, column) => value.padEnd(widths[column], ' ')).join('  ')).join('\n')
}

// Data

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

const input: ArrangementInput<Person> = {
    drivers: people.filter(e => e.capacity > 0).reduce(associateWith(e => e.capacity - 1), new Map()),
    passengers: people.filter(e => e.capacity === 0),
}
    
// Configuration
    
const criteria: ConfiguredCriterion<Person>[] = [
    ConfiguredCriterion(new GroupingCriterion(input, person => person.location), 1, true),
    ConfiguredCriterion(new GroupingCriterion(input, person => person.locationGroup), 1, true),
]

const objective = createObjective(criteria)

const result =
    // random(100)(input)
    //     .map(localSearch(objective))
    //     .reduce(best(objective))

    // greedySearch(objective)(input)

    localSearch(objective)(greedySearch(objective)(input))

    // variations(greedySearch(objective)(input))
    //     .flatMap(variations)
    //     .map(localSearch(objective))
    //     .reduce(best(objective))
    
    // allArrangements(input).reduce(best(objective))

// Results

console.log(`Score: ${objective(result).toFixed(2)}/${criteria.values().map(({weight}) => weight).reduce(sum)}`)
console.log(tabulate(transposeUneven(result.map(car => occupantsOf(car).map(person => person.name).toArray()), '')))