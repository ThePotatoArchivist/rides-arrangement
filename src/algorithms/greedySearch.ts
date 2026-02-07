import { Arrangement, ArrangementInput, Car } from '../data/model.js';
import { ObjectiveFunction } from '../data/objective.js';

function greedySearch<P>(
    objective: ObjectiveFunction<P>, 
    preprocess: (passengers: P[]) => P[] = p => p,
    initial: (input: ArrangementInput<P>) => Arrangement<P> = 
        input => input.drivers.keys().map(driver => ({ driver, passengers: [] })).toArray()
) {
    return (input: ArrangementInput<P>): Arrangement<P> => {
        const arrangement: Arrangement<P> = initial(input)
        const passengers = preprocess(input.passengers.filter(p => !arrangement.some(car => car.passengers.includes(p))))
        for (const passenger of passengers) {
            let bestCar: Car<P>
            let bestScore = -1

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