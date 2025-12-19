import { ArrangementInput } from '../data/model.js'
import { range } from '../util/iterators.js'

function draw<T>(values: T[]) {
    return values.splice(Math.floor(values.length * Math.random()), 1)[0]
}

function random(attempts: number) {
    return <P>(input: ArrangementInput<P>) => range(attempts)
        .map(() => {
            const passengers = [...input.passengers]

            return input.drivers.entries().map(([driver, capacity]) => (
                { driver, passengers: range(capacity).map(() => draw(passengers)).toArray() }
            )).toArray()
        })
}

export { random }