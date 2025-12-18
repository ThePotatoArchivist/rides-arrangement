import { combinations, groups, range } from './counting.js';
import { ArrangementSolver, ObjectiveFunction } from "./criteria.js";
import { logEvery, maxBy } from "./iterators.js";
import { Arrangement, ArrangementInput, Car } from './model.js';


const bruteForce: ArrangementSolver = <P>(input: ArrangementInput<P>, objective: ObjectiveFunction<P>) => {
    const drivers = input.drivers.keys().toArray()
    return groups(input.passengers, input.drivers.values().toArray())
            .map(logEvery(1000000))
            .map(cars => cars.map((car, index) => ({ driver: drivers[index], passengers: car })))
            .reduce(maxBy(arrangement => objective(arrangement), cars => cars.map(({driver, passengers}) => ({driver, passengers: [...passengers]}))))
}

function draw<T>(values: T[]) {
    return values.splice(Math.floor(values.length * Math.random()), 1)[0]
}

interface SwapRef<P> {
    carA: Car<P>
    passengerA: number
    carB: Car<P>
    passengerB: number
}

function swap<P>(ref: SwapRef<P>) {
    const { carA, passengerA, carB, passengerB } = ref
    
    const temp = carA.passengers[passengerA]
    carA.passengers[passengerA] = carB.passengers[passengerB]
    carB.passengers[passengerB] = temp
}

const sloping: ArrangementSolver = <P>(input: ArrangementInput<P>, objective: ObjectiveFunction<P>) => {
    const passengers = [...input.passengers]
    const arrangement: Arrangement<P> = input.drivers.entries().map(([driver, capacity]) => (
        { driver, passengers: range(capacity).map(() => draw(passengers)).toArray() }
    )).toArray()
    
    let bestSwap: SwapRef<P> | undefined = undefined
    let bestScore = objective(arrangement)
    
    let iterations = 0
    while (true) {
        iterations++
        for (const [carA, carB] of combinations(arrangement, 2))
            for (let passengerA = 0; passengerA < carA.passengers.length; passengerA++)
                for (let passengerB = 0; passengerB < carB.passengers.length; passengerB++) {
                    const swapRef: SwapRef<P> = { carA, passengerA, carB, passengerB }
                    swap(swapRef)
                    const score = objective(arrangement)
                    if (score > bestScore) {
                        bestSwap = swapRef
                        bestScore = score
                    }
                    swap(swapRef)
                }

        if (bestSwap === undefined) {
            console.log(`Completed in ${iterations} iterations`)
            console.log(`Score: ${bestScore}`)
            return arrangement
        }

        swap(bestSwap)
        bestSwap = undefined
    }
}

export { bruteForce, sloping }