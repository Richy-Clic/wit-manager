import React, { useEffect, useState } from "react";
import { Paper, Table, TableBody, TableContainer, TableHead, TablePagination, TableRow, TableCell, Button, CircularProgress } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from "react-router-dom";
import { StyledTableCell } from "../styles/index.js";
import AlertConfirm from "../components/AlertConfirm.jsx";
import axios from "axios";


const columns = [
  { id: "index", label: "ID" },
  { id: "name", label: "Nombre Invitado", minWidth: 150 },
  { id: "phone", label: "Teléfono" },
  { id: "mate", label: "Acompañante" },
  { id: "status", label: "Estatus" },
  { id: "acciones", minWidth: 150 }
];


export default function Weddings(params) {

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [openModal, setOpenModal] = useState(false);
  const [row, setRow] = useState({});
  const [guestsList, setGuestsList] = useState()

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

  const guetGuestList = async (uuid_wedding) => {
    try {
      const response = await axios.get(`http://localhost:3001/guests/${uuid_wedding}`);
      setGuestsList(response.data.guestsList);
    } catch (error) {
      console.log('Ocurrio un error al obtener la lista de invitados', error)
    }

  }

  useEffect(() => {
    try {
      setTimeout(() => {
        guetGuestList(params.uuid)
      }, 1500);
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
              guestsList ?
                guestsList
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((wedding, index) => {
                    const guestName = wedding.guest_lastName ? wedding.guest_names + " " + wedding.guest_lastNames : wedding.guest_names
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                        <TableCell key={wedding.id}> {wedding.uuid} </TableCell>
                        <TableCell key={wedding.id} align={wedding.align}>{guestName}</TableCell>
                        <TableCell key={wedding.id} align={wedding.align}>{wedding.telephone}</TableCell>
                        <TableCell key={wedding.id} align={wedding.align}>{wedding.mate}</TableCell>
                        <TableCell key={wedding.id} align={wedding.align}>{wedding.attendance}</TableCell>
                        <TableCell key={wedding.id} align={wedding.align}>
                          <Link to={`/weddings/${wedding.uuid_wedding}`}><Button variant="text" color="warning"><EditIcon /></Button></Link>
                          <Button variant="text" color="error" onClick={() => openAlertConfirm(wedding)}><DeleteIcon /></Button>
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
        count={guestsList ? guestsList.length : 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <AlertConfirm show={openModal} onHide={closeAlertConfirm} row={row} />
    </Paper>
  );
}
