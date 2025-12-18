interface Car<P> {
    driver: P
    passengers: P[]
}

function* occupantsOf<P>(car: Car<P>): Generator<P> {
    yield car.driver
    yield* car.passengers
}

type Arrangement<P> = Car<P>[]

interface ArrangementInput<P> {
    drivers: Map<P, number> // Capacity
    passengers: P[]
}

export { Car, Arrangement, ArrangementInput, occupantsOf }