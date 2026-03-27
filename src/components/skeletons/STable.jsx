import { TableRow, TableCell, Skeleton } from "@mui/material";

const SkeletonTable = ({ rows = 5 }) => {
  return Array.from({ length: rows }).map((_, i) => (
    <TableRow key={i}>
      <TableCell><Skeleton width="80%" /></TableCell>
      <TableCell><Skeleton width="60%" /></TableCell>
      <TableCell><Skeleton width="70%" /></TableCell>
      <TableCell><Skeleton width={80} height={24} /></TableCell>
      <TableCell><Skeleton variant="circular" width={32} height={32} /></TableCell>
    </TableRow>
  ));
};

export default SkeletonTable;