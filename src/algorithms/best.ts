import { copyArrangement } from '../data/model.js';
import { ObjectiveFunction } from '../data/objective.js';
import { maxBy } from '../util/iterators.js';

function best<P>(objective: ObjectiveFunction<P>) {
    return maxBy(objective, copyArrangement)
}

export { best }