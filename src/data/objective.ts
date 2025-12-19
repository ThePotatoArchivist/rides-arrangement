import { Arrangement, ArrangementInput } from './model.js'
import { sum } from '../util/iterators.js'

type ObjectiveFunction<P> = (arrangement: Arrangement<P>) => number

type ArrangementSolver = <P>(input: ArrangementInput<P>, objective: ObjectiveFunction<P>) => Arrangement<P>
type ArrangementProducer = <P>(input: ArrangementInput<P>, objective: ObjectiveFunction<P>) => IteratorObject<Arrangement<P>>
type ArrangementProcessor = <P>(arrangement: Arrangement<P>, objective: ObjectiveFunction<P>) => Arrangement<P>

function chain(initial: ArrangementSolver, ...processors: ArrangementProcessor[]): ArrangementSolver {
    return (input, objective) => processors.reduce((previous, processor) => processor(previous, objective), initial(input, objective))
}
function map(producer: ArrangementProducer, ...processors: ArrangementProcessor[]): ArrangementProducer {
    return (input, objective) => processors.reduce(
        (previous, processor) => previous.map(arrangement => processor(arrangement, objective)), 
        producer(input, objective)
    )
}

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

export { ObjectiveFunction, ArrangementSolver, ArrangementProducer, ArrangementProcessor, chain, map, Criterion, ConfiguredCriterion, compileObjective }