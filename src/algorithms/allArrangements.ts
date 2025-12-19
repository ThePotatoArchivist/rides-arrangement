import { groups } from '../util/counting.js'
import { logEvery } from '../util/iterators.js'
import { Arrangement, ArrangementInput } from '../data/model.js'

function allArrangements<P>(input: ArrangementInput<P>): IteratorObject<Arrangement<P>> {
    const drivers = input.drivers.keys().toArray()
    return groups(input.passengers, input.drivers.values().toArray())
            .map(logEvery(1000000))
            .map(cars => cars.map((car, index) => ({ driver: drivers[index], passengers: car })))
}

export { allArrangements }