import { Arrangement } from '../data/model.js';
import { swap, generateSwaps } from '../data/swap.js';

function* variations<P>(arrangement: Arrangement<P>): Generator<Arrangement<P>> {
    for (const swapRef of generateSwaps(arrangement)) {
        swap(swapRef)
        yield arrangement
        swap(swapRef)
    }
}

export { variations }