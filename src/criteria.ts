import { distinct, sum } from "./iterators.js";
import { Arrangement, occupantsOf, Person } from "./model.js";

abstract class Criteria {
    abstract getRawScore(arrangement: Arrangement): number
    
    getScore(arrangement: Arrangement, weight: number, inverted: boolean) {
        const rawScore = this.getRawScore(arrangement)
        return weight * (inverted ? 1 - rawScore : rawScore)
    }
}

class GroupingCriteria<T extends string> extends Criteria {
    constructor(readonly groupFunction: (person: Person) => T) {
        super()
    }

    getRawScore(arrangement: Arrangement): number {
        return arrangement[Symbol.iterator]()
            .map(car => occupantsOf(car)
                .map(person => this.groupFunction(person))
                .reduce(distinct(), new Set())
                .size
            )
            .reduce(sum)
    }
}

export { Criteria, GroupingCriteria }