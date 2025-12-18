import { distinct, sum } from "./util/iterators.js";
import { Arrangement, ArrangementInput, occupantsOf } from "./data/model.js";
import { compileObjective, Criterion } from './data/objective.js';

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

export { GroupingCriterion };