import React, { useState } from "react";
import { useWeddings } from "../hooks/useWeddings.js";
import { useDebounce } from "../hooks/useDebounce";

import { Paper, Table, TableBody, TableContainer, TableHead, TablePagination, TableRow, TableCell, CircularProgress, Tooltip, Chip, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import { StyledTableCell } from "../styles/index.js";
import renderDateChip from "../utils/renderDateChip";

import PropTypes from "prop-types";
import AlertConfirm from "../components/AlertConfirm.jsx";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PeopleIcon from '@mui/icons-material/People';


const columns = [
  { id: "novios", label: "Novios", minWidth: 220 },
  { id: "fecha", label: "Fecha y Hora" },
  { id: "ubicacion", label: "Ubicación", minWidth: 170 },
  { id: "estatus", label: "Estatus", minWidth: 100 },
  { id: "acciones", minWidth: 150 },
];

const WeddingsList = ({ search }) => {
  const { weddings, loading } = useWeddings();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [openModal, setOpenModal] = useState(false);
  const [row, setRow] = useState(null);
  const debouncedSearch = useDebounce(search, 300);


  const filteredWeddings = (weddings || []).filter((wedding) =>
    `${wedding.boyfriend} ${wedding.girlfriend} ${wedding.location} ${wedding.state}`
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase())
  );

  const openAlertConfirm = (wedding) => {
    setRow(wedding);
    setOpenModal(true);
  };

  const closeAlertConfirm = () => {
    setOpenModal(false);
    setRow(null);
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
      ["en progreso", { label: "En progreso", color: "black", bg: "orange" }],
      ["finalizada", { label: "Finalizada", color: "white", bg: "green" }],
      ["cancelada", { label: "Cancelada", color: "white", bg: "red" }],
    ]);

    return states.get(state) || { label: "Desconocido", color: "black", bg: "gray" };
  }

  



  if (loading) return <CircularProgress style={{ margin: 50, display: "block", marginLeft: "auto", marginRight: "auto" }} />;
  if (!loading && (!weddings || weddings.length === 0)) return <div style={{ textAlign: "center", marginTop: 50 }}> No tienes bodas registradas </div>;
  if (!filteredWeddings.length) return <div style={{ textAlign: "center", marginTop: 50 }}> No se encontraron resultados </div>;


  return (
    <Paper variant="card" sx={{ width: "100%" }}>
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
            {filteredWeddings
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((w) => (
                <TableRow key={w.id} hover sx={{
                  "&:hover .row-actions": {
                    opacity: 1
                  }
                }}>
                  <TableCell>{w.boyfriend} & {w.girlfriend}</TableCell>
                  <TableCell>{renderDateChip(w.date)}</TableCell>
                  {/* <TableCell>{getStringDate(w.date)}</TableCell> */}
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
        count={filteredWeddings.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {row && <AlertConfirm show={openModal} onHide={closeAlertConfirm} row={row} />}
    </Paper>
  );
}

WeddingsList.propTypes = {
  search: PropTypes.string.isRequired,
};

export default WeddingsList;
