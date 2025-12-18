import { groups } from './counting.js';
import { ArrangementSolver } from "./criteria.js";
import { logEvery, maxBy } from "./iterators.js";


const bruteForce: ArrangementSolver = (input, objective) => {
    const drivers = input.drivers.keys().toArray()
    return groups(input.passengers, input.drivers.values().toArray())
            .map(logEvery(1000000))
            .map(cars => cars.map((car, index) => ({ driver: drivers[index], passengers: car })))
            .reduce(maxBy(arrangement => objective(arrangement), cars => cars.map(({driver, passengers}) => ({driver, passengers: [...passengers]}))))
}

export { bruteForce }