// Data models to describe arrangements
// Way to specify criteria
// Way to build a reward function from that
// Procedure to optimize

import { grouping, similarity, singlePeer } from "./data/criteria.js";
import { associateWith, distinct, sum } from "./util/iterators.js";
import { ArrangementInput, copyArrangement, occupantsOf } from "./data/model.js";
import { createObjective, ConfiguredCriterion } from './data/objective.js';
import { localSearch } from './algorithms/localSearch.js';
import { greedySearch } from './algorithms/greedySearch.js';
import { variations } from './algorithms/variations.js';
import { best } from './algorithms/best.js';
import { random } from './algorithms/random.js';
import { allArrangements } from './algorithms/allArrangements.js';
import { tabulate, transposeUneven } from './util/tables.js';
import { readCsv } from './util/csv.js';
import { ifNaN, shuffle } from './util/misc.js';

// Data

const FILENAME = process.argv[2]

type PersonKeys = 
    | 'Full Name'
    | 'What year are you?'
    | 'If you can drive, how many can you take?'
    | 'How hungry are you?'
    | 'Have you been to IV before?'
    | 'If someone invited you, who was it?'
    | 'Any other information you\'d like to tell us?'

interface Person {
    name: string,
    year: string,
    capacity: number,
    hungry: string,
    new: boolean,
    friendName: string,
    friend: Person | undefined,
}

const people = await readCsv<Person, PersonKeys>(FILENAME, ({
    "Full Name": name, 
    "What year are you?": year,
    "If you can drive, how many can you take?": capacity,
    "How hungry are you?": hungry,
    "Have you been to IV before?": isNew,
    "If someone invited you, who was it?": friendName,
}) => ({
    name,
    year,
    capacity: capacity.trim() === "" ? 0 : parseInt(capacity),
    hungry,
    new: isNew === "Yes",
    friendName,
    friend: undefined,
}))

for (const person of people) {
    person.friend = people.find(other => other.name === person.friendName)
}

console.log(JSON.stringify(people))

const input: ArrangementInput<Person> = {
    drivers: people.filter(e => e.capacity > 1).reduce(associateWith(e => e.capacity - 1), new Map()),
    passengers: people.filter(e => e.capacity === 0),
}

// console.log(people.map(p => p.location).reduce(distinct(), new Set()))
    
// Configuration

const locations: Record<string, string> = {
  'Mesa': 'Campus',
  'Off Campus': 'Off Campus',
  '': 'Off Campus',
  '???': 'Off Campus',
  'ACC/VDC': 'ACC',
  'ACC/PV': 'ACC',
  'UTC': 'Campus',
  'ACC/Puerta': 'ACC',
  'ACC/Camino': 'ACC',
  'Middle Earth': 'Campus',
  'Grad Housing': 'Campus',
  'ACC/AV': 'ACC',
  'Mesa? Middle Earth?': 'Campus',
}
    
const criteria: ConfiguredCriterion<Person>[] = [
    ConfiguredCriterion(grouping(person => person.year), 1, false),
    ConfiguredCriterion(grouping(person => person.new), 1, false),
    ConfiguredCriterion(grouping(person => person.hungry), 4, true),
    ConfiguredCriterion(singlePeer(person => person.friend), 8, false),
]

const objective = createObjective(criteria)

const result =
    // random(100)(input)
    //     .map(localSearch(objective))
    //     .reduce(best(objective))

    greedySearch(objective)(input)

    // localSearch(objective)(greedySearch(objective, p => p.toSorted(shuffle))(input))

    // variations(greedySearch(objective)(input))
    //     .flatMap(variations)
    //     .map(localSearch(objective))
    //     .reduce(best(objective))
    
    // allArrangements(input).reduce(best(objective))

console.log(`Score: ${objective(result).toFixed(2)}/${criteria.values().map(c => c.weight).reduce(sum)}`)
console.log(tabulate(transposeUneven(result.map(car => occupantsOf(car).map(p => p.name).toArray()), '')))
