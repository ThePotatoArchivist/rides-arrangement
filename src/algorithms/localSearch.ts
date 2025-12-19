import { ObjectiveFunction } from "../data/objective.js";
import { Arrangement } from '../data/model.js';
import { swap, SwapRef, generateSwaps } from '../data/swap.js';

function localSearch<P>(objective: ObjectiveFunction<P>) {
    return (arrangement: Arrangement<P>): Arrangement<P> => {
        let bestSwap: SwapRef<P> | undefined = undefined
        let bestScore = objective(arrangement)
        
        while (true) {
            for (const swapRef of generateSwaps(arrangement)) {
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

export { localSearch }