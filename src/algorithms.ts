import { ArrangementSolver } from "./criteria.js";
import { compareBy, logEvery, maxBy } from "./iterators.js";
import { Arrangement, ArrangementInput, Car } from "./model.js";

function* permutations<T>(values: T[]) {
    const indices = new Map(values.entries().map(([index, value]) => [value, index]))

    while (true) {
        yield values

        const pivot = values.findLastIndex((value, index, array) => indices.get(value)! > indices.get(array[index - 1])!)
        
        if (pivot < 0) return

        const oldPivotValue = values[pivot - 1]
        const endValues = values.slice(pivot - 1)
        endValues.sort(compareBy(value => indices.get(value)!))
        
        const newPivot = endValues.findIndex(value => indices.get(value)! > indices.get(oldPivotValue)!)
        values[pivot - 1] = endValues[newPivot];
        endValues.splice(newPivot, 1)
        for (let i = 0; i < endValues.length; i++)
            values[pivot + i] = endValues[i]
    }
}

function* combinations<T>(values: T[], size: number) {
    const indices = new Map(values.entries().map(([index, value]) => [value, index]))
    
    let current = values.slice(0, size)
    
    while (true) {
        
        yield current

        const pivot = current.findLastIndex((value, index) => value != values[values.length - size + index]) // Key of current
        if (pivot == -1) return
        
        const pivotIndex = indices.get(current[pivot])! // key of values
        const nextCount = size - pivot // values.slice(pivotIndex + 1, pivotIndex + 1 + size - pivot)
        for (let i = 0; i < nextCount; i++) {
            current[size - nextCount + i] = values[pivotIndex + 1 + i]
        }
    }
}

function* groups<T>(values: T[], sizes: number[], offset: number = 0): Generator<T[][]> {
    if (offset >= sizes.length) {
        yield []
        return
    }
    
    yield* combinations(values, sizes[offset])
        .flatMap(car => groups(values.filter(e => !car.includes(e)), sizes, offset + 1)
            .map(others => [car, ...others]))
}

const bruteForce: ArrangementSolver = (input, objective) => {
    const drivers = input.drivers.keys().toArray()
    return groups(input.passengers, input.drivers.values().toArray())
            .map(logEvery(1000000))
            .map(cars => cars.map((car, index) => ({ driver: drivers[index], passengers: car })))
            .reduce(maxBy(arrangement => objective(arrangement), cars => cars.map(({driver, passengers}) => ({driver, passengers: [...passengers]}))))
}

export { bruteForce, permutations, combinations, groups }