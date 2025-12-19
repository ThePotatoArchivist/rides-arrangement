import { Arrangement, ArrangementInput, Car } from '../data/model.js';
import { ObjectiveFunction } from '../data/objective.js';

function greedySearch<P>(objective: ObjectiveFunction<P>) {
    return (input: ArrangementInput<P>): Arrangement<P> => {
        const arrangement: Arrangement<P> = input.drivers.entries().map(([driver]) => ({ driver, passengers: [] })).toArray()
        
        for (const passenger of input.passengers) {
            let bestCar: Car<P>
            let bestScore = 0

            for (const car of arrangement) {
                if (car.passengers.length >= input.drivers.get(car.driver)!) continue

                car.passengers.push(passenger)

                const score = objective(arrangement)
                if (score > bestScore) {
                    bestCar = car
                    bestScore = score
                }            

                car.passengers.pop()
            }

            bestCar!.passengers.push(passenger)
        }
        
        return arrangement
    }
}

export { greedySearch }