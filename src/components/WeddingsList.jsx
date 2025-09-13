import React, { useState } from "react";
import { Paper, Table, TableBody, TableContainer, TableHead, TablePagination, TableRow, TableCell, Button, CircularProgress, Tooltip } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ViewListIcon from '@mui/icons-material/ViewList';
import { Link } from "react-router-dom";
import { StyledTableCell } from "../styles/index.js";
import AlertConfirm from "../components/AlertConfirm.jsx";
import { useWeddings } from "../hooks/useWeddings.js";



const columns = [
  { id: "index", minWidth: 20 },
  { id: "novios", label: "Novios", minWidth: 220 },
  { id: "fecha", label: "Fecha" },
  { id: "ubicacion", label: "Ubicación", minWidth: 170 },
  { id: "estatus", label: "Estatus" },
  { id: "acciones", minWidth: 200 },
];


export default function Weddings() {

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const { weddings, loading } = useWeddings();
  const [openModal, setOpenModal] = useState(false);
  const [row, setRow] = useState({});

  const openAlertConfirm = (row) => {
    setRow(row)
    setOpenModal(true);
  };

  const closeAlertConfirm = () => {
    setOpenModal(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (loading) return <CircularProgress style={{ margin: 50, display: "block", marginLeft: "auto", marginRight: "auto" }} />;
  if (!weddings?.length) return <div style={{ textAlign: "center", marginTop: 50 }}>No tienes bodas registradas</div>;


 
  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <StyledTableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                  {column.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {weddings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((w, index) => (
              <TableRow key={w.id} hover>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell>{w.boyfriend} & {w.girlfriend}</TableCell>
                <TableCell>{w.date}</TableCell>
                <TableCell>{w.location}</TableCell>
                <TableCell>{w.state}</TableCell>
                <TableCell align={w.align}>
                        <Link to={`/weddings/${w.id}`}>
                          <Tooltip arrow title="Editar">
                            <Button variant="text" color="warning"><EditIcon /></Button>
                          </Tooltip>
                        </Link>
                        <Link to={`/weddings/${w.id}/guests`}>
                          <Tooltip arrow title="Lista de invitados">
                            <Button variant="text" color="success"><ViewListIcon /></Button>
                          </Tooltip>
                        </Link>
                        <Tooltip arrow title="Eliminar">
                          <Button variant="text" color="error" onClick={() => openAlertConfirm(w)}>
                            <DeleteIcon />
                          </Button>
                        </Tooltip>
                      </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={weddings ? weddings.length : 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <AlertConfirm show={openModal} onHide={closeAlertConfirm} row={row} />
    </Paper>
  );
}
