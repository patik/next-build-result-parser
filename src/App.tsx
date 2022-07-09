import { useEffect, useState } from 'react'
import { FileUploader } from 'react-drag-drop-files'
import './styles.css'
import { toEntry, getEntryFromFile } from './utils'
import DataTable from './DataTable'
import EnhancedTable from './EnhancedTable'

export default function App() {
    const [entries, setEntries] = useState<Entry[]>([])
    const addEntry = (entry: Entry) => {
        setEntries((oldList) => {
            // Check for duplicates based on the filename
            if (oldList.find((e) => e.name === entry.name)) {
                return oldList
            }

            return [...oldList, entry]
        })
    }
    const handleChange = (fileList: FileList) => {
        for (let i = 0; i < fileList.length; i++) {
            const file = fileList.item(i)

            if (file) {
                getEntryFromFile(file, addEntry)
            }
        }
    }

    useEffect(() => {
        // https://gist.github.com/patik/d778a5ca1ec05bd2486d363f901b84f3
        fetch('https://api.github.com/gists/d778a5ca1ec05bd2486d363f901b84f3')
            .then((results) => {
                return results.json()
            })
            .then(
                (data: {
                    files: Record<string, { content: string; filename: string }>
                }) => {
                    Object.values(data.files).forEach((file) => {
                        toEntry(
                            file.content,
                            file.filename.replace(/\.txt$/, ''),
                            addEntry,
                        )
                    })
                },
            )
    }, [])

    return (
        <div className="App">
            <div>
                <FileUploader
                    handleChange={handleChange}
                    name="file"
                    types={['TXT']}
                    multiple
                    classes="file-drop-target"
                />
            </div>
            {entries.length > 0 ? (
                <>
                    <div>
                        <DataTable rows={entries} />
                    </div>
                    <div>
                        <EnhancedTable entries={entries} />
                    </div>
                </>
            ) : null}
        </div>
    )
}
