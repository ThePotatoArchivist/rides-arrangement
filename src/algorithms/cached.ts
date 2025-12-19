import { Arrangement, ArrangementInput, copyArrangement } from '../data/model.js';
import { ArrangementSolver, ObjectiveFunction } from '../data/objective.js';

function cached(solver: ArrangementSolver): ArrangementSolver {
    let result: Arrangement<unknown> | undefined = undefined
    return <P>(input: ArrangementInput<P>, objective: ObjectiveFunction<P>) => {
        if (result === undefined)
            result = solver(input, objective)
        return copyArrangement(result) as Arrangement<P>
    }
}

export { cached }