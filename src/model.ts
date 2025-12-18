interface Person {
    name: string
    // phone: number
    /**
     * 0 means needs a ride
     * 1 means can drive self
     * 2+ means can drive self & others
     */
    capacity: number
}


interface Car {
    driver: Person
    passengers: Person[]
}

function* occupantsOf(car: Car): Generator<Person> {
    yield car.driver
    yield* car.passengers
}

type Arrangement = Car[]

interface ArrangementInput {
    drivers: Person[],
    passengers: Person[],
}

export { Person, Car, Arrangement, ArrangementInput, occupantsOf }