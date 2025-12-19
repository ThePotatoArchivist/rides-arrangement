import { Arrangement, ArrangementInput } from '../data/model.js'
import { ArrangementSolver, ObjectiveFunction } from '../data/objective.js'

function repeated(attempts: number, solver: ArrangementSolver): ArrangementSolver {
    return <P>(input: ArrangementInput<P>, objective: ObjectiveFunction<P>) => {
        let bestArrangement: Arrangement<P>
        let bestScore = 0
        
        for (let i = 0; i < attempts; i++) {
            const arrangement = solver(input, objective)
            const score = objective(arrangement)
            if (score > bestScore) {
                bestArrangement = arrangement
                bestScore = score
            }
        }
        
        return bestArrangement!
    } 
}

export { repeated }