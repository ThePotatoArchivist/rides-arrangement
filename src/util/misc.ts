
const shuffle = () => Math.random() > 0.5 ? 1 : -1

function ifNaN(value: number, fallback: number) {
    return isNaN(value) ? fallback : value
}

export { shuffle, ifNaN }