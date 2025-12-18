type Collector<T, U> = (previous: U, current: T) => U
type Combiner<T> = Collector<T, T>

function minBy<T>(getValue: (item: T) => number, copier?: (value: T) => T): Combiner<T> {
    return (previous, current) => 
        getValue(current) < getValue(previous) ? copier?.(current) ?? current : previous
}

function maxBy<T>(getValue: (item: T) => number, copier?: (value: T) => T): Combiner<T> {
    return (previous, current) => 
        getValue(current) > getValue(previous) ? copier?.(current) ?? current : previous
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

const min: Combiner<number> = (previous, current) => Math.min(previous, current)
const max: Combiner<number> = (previous, current) => Math.max(previous, current)
const sum: Combiner<number> = (previous, current) => previous + current

function union<T>(): Combiner<Set<T>> {
    return (previous, current) => previous.union(current)
}

function associateWith<K, V>(mapper: (key: K) => V): Collector<K, Map<K, V>> {
    return (previous, current) => {
        previous.set(current, mapper(current))
        return previous
    }
}

function logEvery<T>(frequency: number): (value: T) => T {
    let iteration = 0
    return value => {
        if (iteration % frequency === 0) console.log(iteration)
        iteration++
        return value
    }
}


export { minBy, maxBy, compareBy, distinct, min, max, sum, union, associateWith, logEvery }