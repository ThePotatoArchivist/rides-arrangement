import { associate, count, distinct, sum, union } from "../util/iterators.js";
import { Arrangement, Car, occupantsOf } from "./model.js";
import { Criterion } from './objective.js';

function grouping<P, T>(groupFunction: (person: P) => T): Criterion<P> {
    return arrangement => arrangement.values()
        .map(car => occupantsOf(car)
            .map(person => groupFunction(person))
            .reduce(distinct(), new Set())
            .size - 1
        )
        .reduce(sum)
        / arrangement.values()
            .map(car => car.passengers.length)
            .reduce(sum, 0)
}

function separation<P>(separate: Set<P>): Criterion<P> {
    return arrangement => arrangement
        .map(car => separate.intersection(new Set(occupantsOf(car))))
        .filter(set => set.size > 1)
        .reduce(union())
        .size
        / separate.size
}

function similarity<P>(original: Arrangement<P>): Criterion<P> {
    return arrangement => {
        const originalCars = original.values()
            .reduce(associate(
                ({driver}) => driver, 
                ({driver}) => original.find(car => car.driver == driver)
            ), new Map<P, Car<P> | undefined>)
        
        return arrangement.values()
            .map(car => {
                const originalCar = originalCars.get(car.driver)
                if (originalCar === undefined) return 0
                return originalCar.passengers.values()
                    .filter(passenger => car.passengers.includes(passenger))
                    .reduce(count, 0)
                    / Math.max(1, originalCar.passengers.length, car.passengers.length)
            })
            .reduce(sum, 0)
            / Math.max(1, arrangement.length)
    }
}

export { grouping, separation, similarity };