import { distinct, sum, union } from "../util/iterators.js";
import { Arrangement, occupantsOf } from "./model.js";
import { Criterion } from './objective.js';

function grouping<P, T extends string>(groupFunction: (person: P) => T): Criterion<P> {
    return (arrangement: Arrangement<P>): number => arrangement.values()
        .map(car => occupantsOf(car)
            .map(person => groupFunction(person))
            .reduce(distinct(), new Set())
            .size - 1
        )
        .reduce(sum)
        / arrangement.values()
            .map(car => car.passengers.length)
            .reduce(sum, 0)
}

function separation<P>(separate: Set<P>): Criterion<P> {
    return (arrangement: Arrangement<P>): number => arrangement
        .map(car => separate.intersection(new Set(occupantsOf(car))))
        .filter(set => set.size > 1)
        .reduce(union())
        .size
        / separate.size
}

export { grouping, separation };