import { Car } from './model.js'

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

export { SwapRef, swap }