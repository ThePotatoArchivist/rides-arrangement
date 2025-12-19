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

interface ConfiguredCriterion<P> {
    criterion: Criterion<P>
    weight: number
    inverted: boolean
}

function ConfiguredCriterion<P>(criterion: Criterion<P>, weight: number, inverted: boolean = false): ConfiguredCriterion<P> {
    return { criterion, weight, inverted }
}

function compileObjective<P>(criteria: ConfiguredCriterion<P>[]): ObjectiveFunction<P> {
    return arrangement => criteria.values().map(({ criterion, weight, inverted }) => criterion.getScore(arrangement, weight, inverted)).reduce(sum)
}

export { ObjectiveFunction, ArrangementSolver, Criterion, ConfiguredCriterion, compileObjective }