import { Box, Typography } from '@mui/material'
import { arraySum, round } from './utils'

export default function Overview({ entries }: { entries: Entry[] }) {
    return (
        <Box px={2}>
            <Typography>
                {`Babel cold, average duration: ${round(
                    arraySum(
                        entries
                            .filter((e) => e.name.includes('babel cold'))
                            .map((e) => e.duration),
                    ) /
                        entries.filter((e) => e.name.includes('babel cold'))
                            .length,
                )} s`}
            </Typography>
            <Typography>
                {`SWC cold, average duration: ${round(
                    arraySum(
                        entries
                            .filter((e) => e.name.includes('swc cold'))
                            .map((e) => e.duration),
                    ) /
                        entries.filter((e) => e.name.includes('swc cold'))
                            .length,
                )} s`}
            </Typography>
            <Typography variant="body1">
                {`Babel warm, average duration: ${round(
                    arraySum(
                        entries
                            .filter((e) => e.name.includes('babel warm'))
                            .map((e) => e.duration),
                    ) /
                        entries.filter((e) => e.name.includes('babel warm'))
                            .length,
                )} s`}
            </Typography>
            <Typography>
                {`SWC warm, average duration: ${round(
                    arraySum(
                        entries
                            .filter((e) => e.name.includes('swc warm'))
                            .map((e) => e.duration),
                    ) /
                        entries.filter((e) => e.name.includes('swc warm'))
                            .length,
                )} s`}
            </Typography>
        </Box>
    )
}
