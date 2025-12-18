import { Arrangement, ArrangementInput } from './model.js'
import { sum } from '../util/iterators.js'

type ObjectiveFunction<P> = (arrangement: Arrangement<P>) => number

type ArrangementSolver = <P>(input: ArrangementInput<P>, objective: ObjectiveFunction<P>) => Arrangement<P>

abstract class Criterion<P> {
    abstract getRawScore(arrangement: Arrangement<P>): number
    
    getScore(arrangement: Arrangement<P>, weight: number, inverted: boolean) {
        const rawScore = this.getRawScore(arrangement)
        return weight * (inverted ? 1 - rawScore : rawScore)
    }
}

function compileObjective<P>(criteria: [criterion: Criterion<P>, weight: number, inverted: boolean][]): ObjectiveFunction<P> {
    return arrangement => criteria.values().map(([criterion, weight, inverted]) => criterion.getScore(arrangement, weight, inverted)).reduce(sum)
}

export { ObjectiveFunction, ArrangementSolver, compileObjective, Criterion }