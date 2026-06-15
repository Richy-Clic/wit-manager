import PropTypes from 'prop-types'
import { Checkbox, TableCell, TableHead, TableRow } from '@mui/material'
import { StyledTableCell } from "../../styles/index.js";

const TableHeader = ({ selected, filteredEvents, handleSelectAll, columns }) => {
  return (
    <>
        <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selected.length > 0 && selected.length < filteredEvents.length
                  }
                  checked={
                    filteredEvents.length > 0 &&
                    selected.length === filteredEvents.length
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              {columns.map((column) => (
                <StyledTableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth, fontWeight: 600 }}>
                  {column.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
    </>
  )
}

TableHeader.propTypes = {
    selected: PropTypes.array.isRequired,
    filteredEvents: PropTypes.array.isRequired,
    handleSelectAll: PropTypes.func.isRequired,
    columns: PropTypes.array.isRequired,
}

export default TableHeader