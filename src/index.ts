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
    location: number
    locationGroup: number
}

function runTest() {
    const people: Person[] = [
      { name: 'P1', capacity: 0, location: 0, locationGroup: 0 },
      { name: 'P2', capacity: 5, location: 1, locationGroup: 1 },
      { name: 'P3', capacity: 0, location: 1, locationGroup: 1 },
      { name: 'P4', capacity: 1, location: 0, locationGroup: 0 },
      { name: 'P5', capacity: 0, location: 2, locationGroup: 2 },
      { name: 'P6', capacity: 0, location: 1, locationGroup: 1 },
      { name: 'P7', capacity: 7, location: 2, locationGroup: 2 },
      { name: 'P8', capacity: 0, location: 3, locationGroup: 2 },
      { name: 'P9', capacity: 0, location: 4, locationGroup: 0 },
      { name: 'P10', capacity: 0, location: 5, locationGroup: 2 },
      { name: 'P11', capacity: 0, location: 1, locationGroup: 1 },
      { name: 'P12', capacity: 0, location: 6, locationGroup: 2 },
      { name: 'P13', capacity: 0, location: 0, locationGroup: 0 },
      { name: 'P14', capacity: 0, location: 7, locationGroup: 0 },
      { name: 'P15', capacity: 4, location: 1, locationGroup: 1 },
      { name: 'P16', capacity: 4, location: 8, locationGroup: 0 },
      { name: 'P17', capacity: 0, location: 9, locationGroup: 2 },
      { name: 'P18', capacity: 0, location: 2, locationGroup: 2 },
      { name: 'P19', capacity: 3, location: 1, locationGroup: 1 },
      { name: 'P20', capacity: 0, location: 1, locationGroup: 1 },
      { name: 'P21', capacity: 0, location: 2, locationGroup: 2 },
      { name: 'P22', capacity: 4, location: 1, locationGroup: 1 },
      { name: 'P23', capacity: 0, location: 7, locationGroup: 0 },
      { name: 'P24', capacity: 5, location: 1, locationGroup: 1 },
      { name: 'P25', capacity: 0, location: 1, locationGroup: 1 },
      { name: 'P26', capacity: 0, location: 0, locationGroup: 0 },
      { name: 'P27', capacity: 0, location: 5, locationGroup: 2 },
      { name: 'P28', capacity: 0, location: 0, locationGroup: 0 },
      { name: 'P29', capacity: 0, location: 1, locationGroup: 1 },
      { name: 'P30', capacity: 0, location: 1, locationGroup: 1 },
      { name: 'P31', capacity: 0, location: 1, locationGroup: 1 },
      { name: 'P32', capacity: 0, location: 1, locationGroup: 1 },
      { name: 'P33', capacity: 0, location: 1, locationGroup: 1 }
    ]

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
}