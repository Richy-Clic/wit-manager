import { TableCell, tableCellClasses, styled } from "@mui/material";

export const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#1976d2",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  }
}));

export const StyleSonnar = {
  success: {
    background: "#d1fae5",
    color: "#065f46",
    borderRadius: "8px"
  },
  warning: {
    background: "#f2ff8d",
    color: "#000",
    borderRadius: "8px"
  },
  error: {
    background: "#fee2e2",
    color: "#991b1b",
    borderRadius: "8px"
  }
};