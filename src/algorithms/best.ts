import { ArrangementInput, copyArrangement } from '../data/model.js';
import { ArrangementProducer, ArrangementSolver, ObjectiveFunction } from '../data/objective.js';
import { maxBy } from '../util/iterators.js';

function best(producer: ArrangementProducer): ArrangementSolver {
    return <P>(input: ArrangementInput<P>, objective: ObjectiveFunction<P>) => producer(input, objective)
        .reduce(maxBy(objective, copyArrangement))
}

export { best }