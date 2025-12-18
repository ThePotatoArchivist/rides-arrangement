type Collector<T, U> = (previous: U, current: T) => U

function minBy<T>(getValue: (item: T) => number): Collector<T, T> {
    return (previous, current) => 
        getValue(current) < getValue(previous) ? current : previous
}

const max: Collector<number, number> = (previous, current) => Math.max(previous, current)

function compareBy<T>(getValue: (item: T) => number): (a: T, b: T) => number {
    return (a, b) => getValue(a) - getValue(b)
}

function distinct<T>(): Collector<T, Set<T>> {
    return (previous, current) => {
        previous.add(current)
        return previous
    }
}

const sum: Collector<number, number> = (previous, current) => previous + current

export { minBy, max, compareBy, distinct, sum }