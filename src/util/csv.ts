import { readFile } from "fs/promises"
import parseCsv from 'neat-csv'

async function readCsv<T, R extends keyof any = keyof T>(filename: string, parse: (raw: Record<R, string>) => T): Promise<T[]> {
    return (await parseCsv<Record<R, string>>(await readFile(filename)))
        .map<T>(parse)
}

export { readCsv }