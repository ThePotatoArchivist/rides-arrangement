import { distinct, sum } from "./iterators.js";
import { Arrangement, ArrangementInput, occupantsOf, Person } from "./model.js";

type ArrangementSolver = (input: ArrangementInput, objective: (arrangement: Arrangement) => number) => Arrangement

function compileObjective(criteria: [criterion: Criterion, weight: number, inverted: boolean][]): (arrangement: Arrangement) => number {
    return arrangement => criteria.values().map(([criterion, weight, inverted]) => criterion.getScore(arrangement, weight, inverted)).reduce(sum)
}

abstract class Criterion {
    abstract getRawScore(arrangement: Arrangement): number
    
    getScore(arrangement: Arrangement, weight: number, inverted: boolean) {
        const rawScore = this.getRawScore(arrangement)
        return weight * (inverted ? 1 - rawScore : rawScore)
    }
}

class GroupingCriteria<T extends string> extends Criterion {
    readonly personCount: number

    constructor(input: ArrangementInput, readonly groupFunction: (person: Person) => T) {
        super()
        this.personCount = input.drivers.length + input.passengers.length
    }

    getRawScore(arrangement: Arrangement): number {
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

export { Criterion as Criteria, GroupingCriteria, ArrangementSolver, compileObjective }