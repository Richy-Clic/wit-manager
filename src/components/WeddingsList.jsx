import React, { useEffect, useContext, useState } from "react";
import { Paper, Table, TableBody, TableContainer, TableHead, TablePagination, TableRow, TableCell, Button, CircularProgress, Tooltip } from "@mui/material";
import { WeddingsContext } from "../context/WeddingsProvider";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ViewListIcon from '@mui/icons-material/ViewList';
import { Link } from "react-router-dom";
import { StyledTableCell } from "../styles/index.js";
import AlertConfirm from "../components/AlertConfirm.jsx";


const columns = [
  { id: "index", label: "ID", minWidth: 150},
  { id: "novios", label: "Novios", minWidth: 150 },
  { id: "invitados", label: "Invitados" },
  { id: "fecha", label: "Fecha" },
  { id: "ubicacion", label: "Ubicación", minWidth: 170 },
  { id: "eStatus", label: "Estatus" },
  { id: "acciones", minWidth: 200 }
];


export default function Weddings() {

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const { weddings, getWeddings } = useContext(WeddingsContext);
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

  useEffect(() => {
    try {
      setTimeout(() => {
        getWeddings()
      }, 500);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);
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

            {
              weddings ?
                weddings
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((wedding, index) => {
                  const dateTime = new Date(wedding.date).toISOString().slice(0, 16).split('T')[0]
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      <TableCell key={wedding.id}> {wedding.uuid} </TableCell>
                      <TableCell key={wedding.id}>{`${wedding.girlfriend_name} & ${wedding.boyfriend_name}`}</TableCell>
                      <TableCell key={wedding.id} align={wedding.align}>{wedding.num_guest}</TableCell>
                      <TableCell key={wedding.id} align={wedding.align}>{dateTime}</TableCell>
                      <TableCell key={wedding.id} align={wedding.align}>{wedding.location}</TableCell>
                      <TableCell key={wedding.id} align={wedding.align}>{wedding.status}</TableCell>
                      <TableCell key={wedding.id} align={wedding.align}>
                        <Link to={`/weddings/${wedding.uuid}`}><Tooltip arrow title="Editar"><Button variant="text"  color="warning"><EditIcon /></Button></Tooltip></Link>
                        <Link to={`/weddings/${wedding.uuid}/guests`}><Tooltip arrow title="Lista de invitados"><Button variant="text" color="success"><ViewListIcon /></Button></Tooltip></Link>
                        <Tooltip arrow title="Eliminar"><Button variant="text" color="error" onClick={() => openAlertConfirm(wedding)}><DeleteIcon /></Button></Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
                : <TableRow hover role="checkbox" tabIndex={1}>
                  <TableCell colSpan={8} align="center"><CircularProgress /></TableCell>
                </TableRow>
            }
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
      <AlertConfirm show={openModal} onHide={closeAlertConfirm} row={row}/>
    </Paper>
  );
}
