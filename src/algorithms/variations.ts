import { ArrangementInput } from '../data/model.js';
import { ArrangementProducer, ArrangementSolver, ObjectiveFunction } from '../data/objective.js';
import { swap, SwapRef } from '../data/swap.js';
import { combinations } from '../util/counting.js';

function variations(initial: ArrangementSolver): ArrangementProducer {
    return function*<P>(input: ArrangementInput<P>, objective: ObjectiveFunction<P>) {
        const arrangement = initial(input, objective)
        
        for (const [carA, carB] of combinations(arrangement, 2))
            for (let passengerA = 0; passengerA < carA.passengers.length; passengerA++)
                for (let passengerB = 0; passengerB < carB.passengers.length; passengerB++) {
                    const swapRef: SwapRef<P> = { carA, passengerA, carB, passengerB }
                    swap(swapRef)
                    yield arrangement
                    swap(swapRef)
                }
    }
}

export { variations }