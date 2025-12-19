import { combinations } from '../util/counting.js'
import { Arrangement, Car } from './model.js'

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

function* generateSwaps<P>(arrangement: Arrangement<P>): Generator<SwapRef<P>> {
    for (const [carA, carB] of combinations(arrangement, 2))
        for (let passengerA = 0; passengerA < carA.passengers.length; passengerA++)
            for (let passengerB = 0; passengerB < carB.passengers.length; passengerB++)
                yield { carA, passengerA, carB, passengerB }
}

export { SwapRef, swap, generateSwaps }