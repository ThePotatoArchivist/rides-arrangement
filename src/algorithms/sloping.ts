import { combinations } from '../util/counting.js';
import { ArrangementSolver, ObjectiveFunction } from "../data/objective.js";
import { Arrangement, ArrangementInput, Car } from '../data/model.js';
import { range } from '../util/iterators.js';


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

function sloping(initialArrangement: ArrangementSolver): ArrangementSolver {
    return <P>(input: ArrangementInput<P>, objective: ObjectiveFunction<P>) => {
        const arrangement: Arrangement<P> = initialArrangement(input, objective)
        
        let bestSwap: SwapRef<P> | undefined = undefined
        let bestScore = objective(arrangement)
        
        while (true) {
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

            if (bestSwap === undefined)
                return arrangement

            swap(bestSwap)
            bestSwap = undefined
        }
    }
}

export { sloping }