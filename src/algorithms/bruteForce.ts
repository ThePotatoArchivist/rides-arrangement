import { groups } from '../util/counting.js'
import { ArrangementSolver, ObjectiveFunction } from '../data/objective.js'
import { logEvery, maxBy } from '../util/iterators.js'
import { ArrangementInput, copyArrangement } from '../data/model.js'

const bruteForce: ArrangementSolver = <P>(input: ArrangementInput<P>, objective: ObjectiveFunction<P>) => {
    const drivers = input.drivers.keys().toArray()
    return groups(input.passengers, input.drivers.values().toArray())
            .map(logEvery(1000000))
            .map(cars => cars.map((car, index) => ({ driver: drivers[index], passengers: car })))
            .reduce(maxBy(objective, copyArrangement))
}

export { bruteForce }