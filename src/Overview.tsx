import { Box, Typography } from '@mui/material'
import { arraySum } from './utils'

export default function Overview({ entries }: { entries: Entry[] }) {
    return (
        <Box>
            <Typography variant="h2">
                Overall average time for production builds
            </Typography>
            <Box py={1}>
                <Typography variant="body2">
                    Cold build:{' '}
                    <code>git clean -fdx && yarn install && yarn build</code>
                </Typography>
                <Typography variant="body2" gutterBottom>
                    Warm build: <code>yarn build</code> after a cold build has
                    completed
                </Typography>
            </Box>
            <Typography>
                {`Babel, cold: ${Math.round(
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
                {`SWC, cold: ${Math.round(
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
                {`Babel, warm: ${Math.round(
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
                {`SWC, warm: ${Math.round(
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
