import { useState } from 'react'
import { FileUploader } from 'react-drag-drop-files'
import './styles.css'
import EnhancedTable from './EnhancedTable'
import { toEntry } from './utils'

export default function App() {
    const [entries, setEntries] = useState<Entry[]>([])
    const handleChange = (fileList: FileList) => {
        for (let i = 0; i < fileList.length; i++) {
            const file = fileList.item(i)

            if (file) {
                toEntry(file, (entry) =>
                    setEntries((oldList) => [...oldList, entry]),
                )
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
                    classes="file-drop-target"
                />
            </div>
            {entries.length > 0 ? (
                <div>
                    <EnhancedTable entries={entries} />
                </div>
            ) : null}
        </div>
    )
}
