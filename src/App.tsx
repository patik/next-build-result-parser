import { useEffect, useState } from 'react'
import { FileUploader } from 'react-drag-drop-files'
import './styles.css'
import { toEntry, getEntryFromFile } from './utils'
// import DataTable from './DataTable'
import EnhancedTable from './EnhancedTable'
import Overview from './Overview'
import { Box } from '@mui/material'
import { Typography } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'

const theme = createTheme({
    typography: {
        h1: {
            fontSize: 36,
        },
        h2: {
            fontSize: 26,
        },
        h3: {
            fontSize: 24,
        },
    },
})

export default function App() {
    const [entries, setEntries] = useState<Entry[]>([])
    const addEntry = (entry: Entry) => {
        setEntries((oldList) => {
            // Check for duplicates based on the filename
            if (
                oldList.find((e) => e.name === entry.name || e.id === entry.id)
            ) {
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
        <ThemeProvider theme={theme}>
            <Box p={1}>
                <Typography variant="h1">Next.js Build Analyzer</Typography>
                <Box py={2}>
                    <FileUploader
                        handleChange={handleChange}
                        name="file"
                        types={['TXT']}
                        multiple
                        classes="file-drop-target"
                    />
                </Box>
                {entries.length > 0 ? (
                    <>
                        <Overview entries={entries} />

                        <EnhancedTable entries={entries} />

                        {/* >
                            <DataTable rows={entries} />
                        </div */}
                    </>
                ) : null}
            </Box>
        </ThemeProvider>
    )
}
