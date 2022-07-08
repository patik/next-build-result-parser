import { useState } from 'react'
import { FileUploader } from 'react-drag-drop-files'
import './styles.css'
import EnhancedTable from './EnhancedTable'
import { toEntry } from './utils'
import sampleData from './sampleData'

export default function App() {
    const [entries, setEntries] = useState<Entry[]>(sampleData)
    const addEntry = (entry: Entry) => {
        setEntries((e) => [...e, entry])
    }
    const handleChange = (fileList: FileList) => {
        for (let i = 0; i < fileList.length; i++) {
            const file = fileList.item(i)

            if (file) {
                toEntry(file, addEntry)
            }
        }
    }

    return (
        <div className="App">
            <div>
                <FileUploader
                    handleChange={handleChange}
                    name="file"
                    types={['TXT']}
                    multiple
                />
            </div>
            {entries.length > 0 ? (
                <div>
                    <p>Results:</p>
                    <EnhancedTable entries={entries} />
                </div>
            ) : null}
        </div>
    )
}
