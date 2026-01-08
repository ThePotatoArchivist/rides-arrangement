import { readFile } from "fs/promises"
import parseCsv from 'neat-csv'

type Raw<T> = Record<keyof T, string>

async function readCsv<T>(filename: string, parse: (raw: Raw<T>) => T): Promise<T[]> {
    return (await parseCsv<Raw<T>>(await readFile(filename)))
        .map<T>(parse)
}

export { readCsv }