import { Arrangement } from './model.js'
import { sum } from '../util/iterators.js'

type ObjectiveFunction<P> = (arrangement: Arrangement<P>) => number

type Criterion<P> = (arrangement: Arrangement<P>) => number

interface ConfiguredCriterion<P> {
    criterion: Criterion<P>
    weight: number
    inverted: boolean
}

function ConfiguredCriterion<P>(criterion: Criterion<P>, weight: number, inverted: boolean = false): ConfiguredCriterion<P> {
    return { criterion, weight, inverted }
}

function createObjective<P>(criteria: ConfiguredCriterion<P>[]): ObjectiveFunction<P> {
    return arrangement => criteria.values().map(({ criterion, weight, inverted }) => {
        const rawScore = criterion(arrangement)
        return weight * (inverted ? 1 - rawScore : rawScore)
    }).reduce(sum)
}

export { ObjectiveFunction, Criterion, ConfiguredCriterion, createObjective }