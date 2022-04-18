import { Tooltip } from '@material-ui/core';
import ErrorIcon from '@mui/icons-material/Error';

export function ResultsMissing() {
  return (
    <>
      <Tooltip title="Simulation results are missing.">
        <ErrorIcon />
      </Tooltip>
    </>
  )
}