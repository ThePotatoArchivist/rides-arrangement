import { distinct, sum } from "./iterators.js";
import { Arrangement, ArrangementInput, occupantsOf } from "./model.js";

type ObjectiveFunction<P> = (arrangement: Arrangement<P>) => number

type ArrangementSolver = <P>(input: ArrangementInput<P>, objective: ObjectiveFunction<P>) => Arrangement<P>

function compileObjective<P>(criteria: [criterion: Criterion<P>, weight: number, inverted: boolean][]): (arrangement: Arrangement<P>) => number {
    return arrangement => criteria.values().map(([criterion, weight, inverted]) => criterion.getScore(arrangement, weight, inverted)).reduce(sum)
}

abstract class Criterion<P> {
    abstract getRawScore(arrangement: Arrangement<P>): number
    
    getScore(arrangement: Arrangement<P>, weight: number, inverted: boolean) {
        const rawScore = this.getRawScore(arrangement)
        return weight * (inverted ? 1 - rawScore : rawScore)
    }
}

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

export { Criterion, GroupingCriterion, ArrangementSolver, ObjectiveFunction, compileObjective }