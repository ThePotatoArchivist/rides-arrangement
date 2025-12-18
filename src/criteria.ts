import { distinct, sum, union } from "./util/iterators.js";
import { Arrangement, ArrangementInput, occupantsOf } from "./data/model.js";
import { Criterion } from './data/objective.js';

class GroupingCriterion<P, T extends string> extends Criterion<P> {
    readonly personCount: number

    constructor(input: ArrangementInput<P>, readonly groupFunction: (person: P) => T) {
        super()
        this.personCount = input.drivers.size + input.passengers.length
    }

    getRawScore(arrangement: Arrangement<P>): number {
        return arrangement[Symbol.iterator]()
            .map(car => occupantsOf(car)
                .map(person => this.groupFunction(person))
                .reduce(distinct(), new Set())
                .size
            )
            .reduce(sum)
            / this.personCount
    }
}

class SeparationCriterion<P> extends Criterion<P> {
    constructor(readonly separate: Set<P>) {
        super()
    }

    getRawScore(arrangement: Arrangement<P>): number {
        return arrangement
            .map(car => this.separate.intersection(new Set(occupantsOf(car))))
            .filter(set => set.size > 1)
            .reduce(union())
            .size
            / this.separate.size
    }
}

export { GroupingCriterion, SeparationCriterion };