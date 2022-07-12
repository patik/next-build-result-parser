import * as React from 'react'
import { alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import DeleteIcon from '@mui/icons-material/Delete'
import FilterListIcon from '@mui/icons-material/FilterList'
import { visuallyHidden } from '@mui/utils'
import { TextField } from '@mui/material'

function isPage(foo: Entry[keyof Entry]): foo is Page {
    if (typeof foo === 'string' || typeof foo === 'number') {
        return false
    }

    if (
        typeof foo === 'object' &&
        Object.prototype.hasOwnProperty.call(foo, 'total') &&
        foo &&
        'total' in foo &&
        typeof foo?.total === 'number'
    ) {
        return true
    }

    return false
}

function descendingComparator(a: Entry, b: Entry, orderBy: keyof Entry) {
    const itemA = a[orderBy]
    const itemB = b[orderBy]

    if (isPage(itemA)) {
        if (isPage(itemB)) {
            if (itemB.total < itemA.total) {
                return -1
            }

            if (itemB.total > itemA.total) {
                return 1
            }
        }

        return 0
    }

    if (b[orderBy] < a[orderBy]) {
        return -1
    }

    if (b[orderBy] > a[orderBy]) {
        return 1
    }

    return 0
}

type Order = 'asc' | 'desc'

function getComparator(
    order: Order,
    orderBy: keyof Entry,
): (a: Entry, b: Entry) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy)
}

interface HeadCell {
    disablePadding: boolean
    id: keyof Entry
    label: string
    numeric: boolean
}

const headCells: readonly HeadCell[] = [
    {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'Run description',
    },
    {
        id: 'duration',
        numeric: true,
        disablePadding: false,
        label: 'Duration',
    },
    {
        id: 'firstLoadJs',
        numeric: true,
        disablePadding: false,
        label: 'First load JS',
    },
    {
        id: 'pages',
        numeric: true,
        disablePadding: false,
        label: 'Pages',
    },
    {
        id: 'sharedJs',
        numeric: true,
        disablePadding: false,
        label: 'Shared JS',
    },
]

interface EnhancedTableProps {
    numSelected: number
    onRequestSort: (
        event: React.MouseEvent<unknown>,
        property: keyof Entry,
    ) => void
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
    order: Order
    orderBy: string
    rowCount: number
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const {
        onSelectAllClick,
        order,
        orderBy,
        numSelected,
        rowCount,
        onRequestSort,
    } = props
    const createSortHandler = (property: keyof Entry) => (
        event: React.MouseEvent<unknown>,
    ) => {
        onRequestSort(event, property)
    }

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={
                            numSelected > 0 && numSelected < rowCount
                        }
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc'
                                        ? 'sorted descending'
                                        : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    )
}

interface EnhancedTableToolbarProps {
    numSelected: number
    setFilter: (s: string) => void
}

const EnhancedTableToolbar = ({
    numSelected,
    setFilter,
}: EnhancedTableToolbarProps) => {
    const [showFilter, setShowFilter] = React.useState(false)

    return (
        <>
            <Toolbar
                sx={{
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                    ...(numSelected > 0 && {
                        bgcolor: (theme) =>
                            alpha(
                                theme.palette.primary.main,
                                theme.palette.action.activatedOpacity,
                            ),
                    }),
                }}
            >
                {numSelected > 0 ? (
                    <>
                        <Typography
                            sx={{ flex: '1 1 100%' }}
                            color="inherit"
                            variant="subtitle1"
                            component="div"
                        >
                            {numSelected} selected
                        </Typography>
                        <Tooltip title="Delete">
                            <IconButton>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </>
                ) : (
                    <>
                        <Typography
                            sx={{ flex: '1 1 100%' }}
                            variant="h3"
                            id="tableTitle"
                            component="div"
                        >
                            Results
                        </Typography>
                        <Tooltip title="Filter list">
                            <IconButton
                                onClick={() => setShowFilter(!showFilter)}
                                color={showFilter ? 'primary' : 'default'}
                            >
                                <FilterListIcon />
                            </IconButton>
                        </Tooltip>
                    </>
                )}
            </Toolbar>
            {showFilter ? (
                <Toolbar
                    sx={{
                        pl: { sm: 2 },
                        pr: { xs: 1, sm: 1 },
                        ...(numSelected > 0 && {
                            bgcolor: (theme) =>
                                alpha(
                                    theme.palette.primary.main,
                                    theme.palette.action.activatedOpacity,
                                ),
                        }),
                    }}
                >
                    <TextField
                        label="Filter by run name"
                        variant="standard"
                        onChange={(evt) => setFilter(evt.target.value)}
                    />
                </Toolbar>
            ) : null}
        </>
    )
}

export default function EnhancedTable({ entries }: { entries: Entry[] }) {
    const [order, setOrder] = React.useState<Order>('asc')
    const [orderBy, setOrderBy] = React.useState<keyof Entry>('duration')
    const [selected, setSelected] = React.useState<readonly string[]>([])
    const [page, setPage] = React.useState(0)
    const [dense, setDense] = React.useState(true)
    const [rowsPerPage, setRowsPerPage] = React.useState(25)
    const [filter, setFilter] = React.useState('')

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Entry,
    ) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const handleSelectAllClick = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (event.target.checked) {
            const newSelecteds = entries.map((n) => n.name)
            setSelected(newSelecteds)
            return
        }
        setSelected([])
    }

    const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
        const selectedIndex = selected.indexOf(name)
        let newSelected: readonly string[] = []

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name)
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1))
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1))
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            )
        }

        setSelected(newSelected)
    }

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked)
    }

    const isSelected = (name: string) => selected.indexOf(name) !== -1

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - entries.length) : 0

    const filteredEntries: Entry[] =
        filter.length > 0
            ? [...entries].filter((entry) => {
                  return entry.name
                      .toLowerCase()
                      .includes(filter.trim().toLowerCase())
              })
            : [...entries]

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ width: '100%', mb: 2 }}>
                <EnhancedTableToolbar
                    numSelected={selected.length}
                    setFilter={setFilter}
                />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={filteredEntries.length}
                        />
                        <TableBody>
                            {filteredEntries
                                .sort(getComparator(order, orderBy))
                                .slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage,
                                )
                                .map((entry, index) => {
                                    const isItemSelected = isSelected(
                                        entry.name,
                                    )
                                    const labelId = `enhanced-table-checkbox-${index}`

                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) =>
                                                handleClick(event, entry.name)
                                            }
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={entry.id}
                                            selected={isItemSelected}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    inputProps={{
                                                        'aria-labelledby': labelId,
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                padding="none"
                                            >
                                                {entry.name}
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                                sx={{
                                                    fontFamily:
                                                        'Menlo, Consolas, monospace',
                                                }}
                                            >{`${entry.duration} s`}</TableCell>
                                            <TableCell
                                                align="right"
                                                sx={{
                                                    fontFamily:
                                                        'Menlo, Consolas, monospace',
                                                }}
                                            >{`${entry.firstLoadJs}`}</TableCell>
                                            <TableCell>
                                                {`${entry.pages.files.length} pages`}
                                                <br />
                                                {`${entry.pages.total}kB total, ${entry.pages.average}kB on average`}
                                            </TableCell>
                                            <TableCell>
                                                {`${entry.sharedJs.files.length} bundles`}
                                                <br />
                                                {`${entry.sharedJs.total}kB total, ${entry.sharedJs.average}kB on average`}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredEntries.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Box>
            <FormControlLabel
                control={
                    <Switch checked={dense} onChange={handleChangeDense} />
                }
                label="Dense padding"
            />
        </Box>
    )
}
