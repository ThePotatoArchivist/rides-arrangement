import { combinations } from '../util/counting.js';
import { ArrangementSolver, ObjectiveFunction } from "../data/objective.js";
import { Arrangement, ArrangementInput, Car } from '../data/model.js';
import { range } from '../util/iterators.js';


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

function repeated(attempts: number, solver: ArrangementSolver): ArrangementSolver {
    return <P>(input: ArrangementInput<P>, objective: ObjectiveFunction<P>) => {
        let bestArrangement: Arrangement<P>
        let bestScore = 0
        
        for (let i = 0; i < attempts; i++) {
            const arrangement = solver(input, objective)
            const score = objective(arrangement)
            if (score > bestScore) {
                bestArrangement = arrangement
                bestScore = score
            }
        }
        
        console.log(`Completed ${attempts} attempts`)
        console.log(`Best Score: ${bestScore}`)
        
        return bestArrangement!
    } 
}

export { sloping, repeated }