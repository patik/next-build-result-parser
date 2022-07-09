import * as React from 'react'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'

const columns: GridColDef[] = [
    { field: 'name', headerName: 'Description', minWidth: 150 },
    { field: 'duration', headerName: 'Duration (s)' },
    { field: 'firstLoadJs', headerName: 'First load JS' },
    {
        field: 'pages',
        headerName: 'Pages',
        type: 'number',
        minWidth: 300,
        valueGetter: ({ row: entry }: GridValueGetterParams<Entry, Entry>) =>
            `${entry.pages.files.length} pages; ${entry.pages.total}kB total, ${entry.pages.average}kB on average`,
    },
    {
        field: 'sharedJs',
        headerName: 'Shared JS',
        minWidth: 300,
        valueGetter: ({ row: entry }: GridValueGetterParams<Entry, Entry>) =>
            `${entry.sharedJs.files.length} bundles; ${entry.sharedJs.total}kB total, ${entry.sharedJs.average}kB on average`,
    },
]

export default function DataTable({ rows }: { rows: Entry[] }) {
    return (
        <div style={{ height: 800, width: '100%' }}>
            <DataGrid<Entry>
                rows={rows}
                columns={columns}
                pageSize={50}
                rowsPerPageOptions={[5, 10, 20, 50, 100]}
                getRowHeight={() => 'auto'}
                checkboxSelection
            />
        </div>
    )
}
