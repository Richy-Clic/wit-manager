import React, { useState } from "react";
import {  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableCell,
  CircularProgress,
  Tooltip,
  Chip,
  IconButton,
  Box } from "@mui/material";
import { Link } from "react-router-dom";
import { StyledTableCell } from "../styles/index.js";
import { useWeddings } from "../hooks/useWeddings.js";
import { format, parseISO } from "date-fns";
import { es } from 'date-fns/locale';
import AlertConfirm from "../components/AlertConfirm.jsx";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PeopleIcon from '@mui/icons-material/People';

import SearchInput from "../components/SearchInput";





const columns = [
  { id: "novios", label: "Novios", minWidth: 220 },
  { id: "fecha", label: "Fecha" },
  { id: "ubicacion", label: "Ubicación", minWidth: 170 },
  { id: "estatus", label: "Estatus", minWidth: 100 },
  { id: "acciones", minWidth: 200 },
];


export default function Weddings() {
  const { weddings, loading } = useWeddings();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [openModal, setOpenModal] = useState(false);
  const [row, setRow] = useState({});
    const [search, setSearch] = useState("");
  

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

  const getStringState = (state) => {
    const states = new Map([
      [1, { label: "In progress", color: "black", bg: "orange" }],
      [2, { label: "Completed", color: "white", bg: "green" }],
      [3, { label: "Cancelled", color: "white", bg: "red" }],
    ]);

    return states.get(state) || { label: "Desconocido", color: "black", bg: "gray" };
  }

  const getStringDate = (date) => {
    const d = parseISO(date);
    return format(d, "EEEE, d 'de' MMMM yyyy HH:mm", { locale: es });
  }

  if (loading) return <CircularProgress style={{ margin: 50, display: "block", marginLeft: "auto", marginRight: "auto" }} />;
  if (!weddings?.length) return <div style={{ textAlign: "center", marginTop: 50 }}>No tienes bodas registradas</div>;



  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        borderRadius: 3,
        border: "1px solid #eee",
        overflow: "hidden"
      }}
    >
      <Box
  sx={{
    p: 2,
    borderBottom: "1px solid #eee",
    background: "#fafafa"
  }}
>
  <SearchInput
    value={search}
    onChange={setSearch}
    placeholder="Buscar boda..."
  />
</Box>
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
            {weddings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((w) => (
              <TableRow key={w.id} hover>
                <TableCell>{w.boyfriend} & {w.girlfriend}</TableCell>
                <TableCell>{getStringDate(w.date)}</TableCell>
                <TableCell>{w.location}</TableCell>
                <TableCell>
                  <Chip
                    label={getStringState(w.state).label}
                    sx={{
                      width: "100%",
                      justifyContent: "center",
                      backgroundColor: getStringState(w.state).bg,
                      color: getStringState(w.state).color,
                      fontWeight: 500,
                      borderRadius: "8px"
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Link to={`/weddings/${w.id}`}>
                    <Tooltip arrow title="Editar">
                      <IconButton color="warning">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </Link>

                  <Link to={`/weddings/${w.id}/guests`}>
                    <Tooltip arrow title="Lista de invitados">
                      <IconButton color="success">
                        <PeopleIcon />
                      </IconButton>
                    </Tooltip>
                  </Link>

                  <Tooltip arrow title="Eliminar">
                    <IconButton color="error" onClick={() => openAlertConfirm(w)}>
                      <DeleteIcon />
                    </IconButton>
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
