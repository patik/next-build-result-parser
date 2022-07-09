import { v4 as uuidv4 } from 'uuid'

export const round = (num: number): number =>
    Math.round((num + Number.EPSILON) * 10) / 10

// https://regex101.com/r/EYz6Hh/1
const pageRegex = /\s+(?<name>(?:└\s+)?\/?\S*)\s+(\((?<time>\d+\s+ms)\)\s+)?(?<size>\d+(?:\.\d+)?\s+\w+)(?:\s+(?<firstjs>\d+(?:\.\d+)?\s+\w+))?/

// https://regex101.com/r/5H9oDt/1
const firstLoadJsRegex = /\+ First Load JS shared by all\s+(?<size>\d+(?:\.\d+)?\s+\w+)/

// https://regex101.com/r/YF3MEf/1
const jsChunkRegex = /\s+[├└]\s+(?<name>\S+)\s+(\((?<time>\d+\s+ms)\)\s+)?(?<size>\d+(?:\.\d+)?\s+\w+)/

// https://regex101.com/r/dX9oww/1
const sizePattern = /(?<value>\d+(?:\.\d+)?)\s+(?<unit>\w+)/

export const arraySum = (arr: number[]): number =>
    arr.reduce((a, b) => a + b, 0)

function getFileSizeInKilobytes(fileResult: FileResult): number {
    const size = fileResult.size
    const pieces = sizePattern.exec(size)

    if (!pieces?.groups) {
        return 0
    }

    const { value, unit } = pieces.groups

    if (unit === 'M') {
        return parseFloat(value) * 1000
    }

    if (unit === 'B') {
        return parseFloat(value) / 1000
    }

    if (unit === 'kB') {
        return parseFloat(value)
    }

    throw new Error(`Unknown filesize unit in “${size}”`)
}

function getTotal(fileResults: FileResult[]) {
    return round(arraySum(fileResults.map(getFileSizeInKilobytes)))
}

export function toEntry(
    text: string,
    name: string,
    callback: (entry: Entry) => void,
) {
    const pages: FileResult[] = []
    const sharedJs: FileResult[] = []
    let firstLoadJs = ''

    text.split('\n').forEach((line) => {
        // Page
        if (
            line.startsWith('└') ||
            line.startsWith('├') ||
            line.startsWith('└')
        ) {
            const pieces = pageRegex.exec(line)

            if (pieces?.groups) {
                pages.push({
                    name: pieces.groups.name,
                    size: pieces.groups.size,
                    time: pieces.groups.time,
                })
            }
        } else if (line.startsWith('+ First Load JS shared by all')) {
            firstLoadJs = firstLoadJsRegex.exec(line)?.groups?.size ?? ''
        } else if (jsChunkRegex.test(line)) {
            const pieces = jsChunkRegex.exec(line)

            if (pieces?.groups) {
                sharedJs.push({
                    name: pieces.groups.name,
                    size: pieces.groups.size,
                    time: pieces.groups.time,
                })
            }
        }
    })

    callback({
        id: uuidv4(),
        name,
        duration: parseFloat(
            (/^Done\sin\s([\w.]+)s.$/m.exec(text) ?? ['0', '0'])[1],
        ),
        pages: {
            total: getTotal(pages),
            average: round(getTotal(pages) / pages.length),
            files: pages,
        },
        sharedJs: {
            total: getTotal(sharedJs),
            average: round(getTotal(sharedJs) / sharedJs.length),
            files: sharedJs,
        },
        firstLoadJs,
    })
}

export async function getEntryFromFile(
    file: File,
    callback: (entry: Entry) => void,
) {
    await file.text().then((text) => {
        toEntry(text, file.name.replace(/\.txt$/, ''), callback)
    })
}
