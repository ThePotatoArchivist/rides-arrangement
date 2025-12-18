import { Criteria } from "./criteria.js";
import { compareBy, minBy } from "./iterators.js";
import { Arrangement, ArrangementInput } from "./model.js";

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

function bruteForce(input: ArrangementInput, criteria: Criteria): Arrangement {
    return permutations(input.passengers)
        .map(passengers => {
            let current = 0
            return input.drivers.map(driver => {
                const start = current
                current += driver.capacity
                return { driver, passengers: passengers.slice(start, current) }
            })
        })
        .reduce(minBy(arrangement => criteria.getRawScore(arrangement)))
}

export { bruteForce }