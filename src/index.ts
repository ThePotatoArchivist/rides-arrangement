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
   | 'If you can drive, how many can you take?'
   | 'Have you been to IV before?'
   | 'If someone invited you, who was it?'
   | 'Any other information you\'d like to tell us?'

interface Person {
    name: string,
    capacity: number,
    new: boolean,
    friendName: string,
    friend: Person | undefined,
}

const people = await readCsv<Person, PersonKeys>(FILENAME, ({
    "Full Name": name, 
    "If you can drive, how many can you take?": capacity,
    "Have you been to IV before?": isNew,
    "If someone invited you, who was it?": friend,
}) => ({
    name: name,
    capacity: capacity.trim() === "" ? 0 : parseInt(capacity),
    new: isNew === "Yes",
    friendName: friend,
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
    ConfiguredCriterion(grouping(person => person.new), 1, false),
    ConfiguredCriterion(singlePeer(person => person.friend), 4, false),
]

const objective = createObjective(criteria)

const result =
    // random(100)(input)
    //     .map(localSearch(objective))
    //     .reduce(best(objective))

    // greedySearch(objective)(input)

    localSearch(objective)(greedySearch(objective, p => p.toSorted(shuffle))(input))

    // variations(greedySearch(objective)(input))
    //     .flatMap(variations)
    //     .map(localSearch(objective))
    //     .reduce(best(objective))
    
    // allArrangements(input).reduce(best(objective))

console.log(`Score: ${objective(result).toFixed(2)}/${criteria.values().map(c => c.weight).reduce(sum)}`)
console.log(tabulate(transposeUneven(result.map(car => occupantsOf(car).map(p => p.name).toArray()), '')))
