// Data models to describe arrangements
// Way to specify criteria
// Way to build a reward function from that
// Procedure to optimize

import { grouping } from "./data/criteria.js";
import { associateWith, sum } from "./util/iterators.js";
import { ArrangementInput, occupantsOf } from "./data/model.js";
import { createObjective, ConfiguredCriterion } from './data/objective.js';
import { localSearch } from './algorithms/localSearch.js';
import { greedySearch } from './algorithms/greedySearch.js';
import { variations } from './algorithms/variations.js';
import { best } from './algorithms/best.js';
import { random } from './algorithms/random.js';
import { allArrangements } from './algorithms/allArrangements.js';
import { tabulate, transposeUneven } from './util/tables.js';
import { readCsv } from './util/csv.js';

// Data

const FILENAME = 'input_large.csv'

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

const people = await readCsv<Person>(FILENAME, raw => ({...raw, capacity: parseInt(raw.capacity)}))

const input: ArrangementInput<Person> = {
    drivers: people.filter(e => e.capacity > 0).reduce(associateWith(e => e.capacity - 1), new Map()),
    passengers: people.filter(e => e.capacity === 0),
}
    
// Configuration
    
const criteria: ConfiguredCriterion<Person>[] = [
    ConfiguredCriterion(grouping(person => person.location), 1, true),
    ConfiguredCriterion(grouping(person => person.locationGroup), 1, true),
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

console.log(`Score: ${objective(result).toFixed(2)}/${criteria.values().map(c => c.weight).reduce(sum)}`)
console.log(tabulate(transposeUneven(result.map(car => occupantsOf(car).map(p => p.name).toArray()), '')))