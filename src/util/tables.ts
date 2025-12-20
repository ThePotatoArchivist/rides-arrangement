import { max, range } from './iterators.js'

function transposeUneven<T>(table: T[][], defaultValue: T): T[][] {
    return range(table.values()
            .map(row => row.length)
            .reduce(max))
        .map(column => table.map(row => row[column] ?? defaultValue))
        .toArray()
}

function tabulate(table: string[][]) {
    const widths = table[0].values()
        .map((_, column) => table
            .map(row => row[column].length)
            .reduce(max))
        .toArray()
    return table
        .map(row => row
            .map((value, column) => value.padEnd(widths[column], ' '))
            .join('  '))
        .join('\n')
}

export { transposeUneven, tabulate }