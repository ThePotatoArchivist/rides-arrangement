type Collector<T, U> = (previous: U, current: T) => U

function minBy<T>(getValue: (item: T) => number, copier?: (value: T) => T): Collector<T, T> {
    return (previous, current) => 
        getValue(current) < getValue(previous) ? copier?.(current) ?? current : previous
}

function maxBy<T>(getValue: (item: T) => number): Collector<T, T> {
    return (previous, current) => 
        getValue(current) > getValue(previous) ? current : previous
}

function compareBy<T>(getValue: (item: T) => number): (a: T, b: T) => number {
    return (a, b) => getValue(a) - getValue(b)
}

function distinct<T>(): Collector<T, Set<T>> {
    return (previous, current) => {
        previous.add(current)
        return previous
    }
}

const min: Collector<number, number> = (previous, current) => Math.min(previous, current)
const max: Collector<number, number> = (previous, current) => Math.max(previous, current)
const sum: Collector<number, number> = (previous, current) => previous + current

function logEvery<T>(frequency: number): (value: T) => T {
    let iteration = 0
    return value => {
        if (iteration % frequency == 0) console.log(iteration)
        iteration++
        return value
    }
}


export { minBy, maxBy, compareBy, distinct, min, max, sum, logEvery }