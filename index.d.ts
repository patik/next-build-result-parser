type FileResult = {
    name: string
    size: string
    time?: string
}

type Page = {
    total: number
    average: number
    files: Array<FileResult>
}

interface Entry {
    id: string
    name: string
    duration: number
    pages: Page
    sharedJs: Page
    firstLoadJs: string
}
