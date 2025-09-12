import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { Paper, Table, TableBody, TableContainer, TableHead, TablePagination, TableRow, TableCell, Button, CircularProgress, Tooltip } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { StyledTableCell } from "../styles/index.js";
import DeleteGuestConfirm from "../components/DeleteGuestConfirm.jsx";
import { GuestsContext } from "../context/GuestsProvider.jsx";

const columns = [
  { id: "index", label: "ID" },
  { id: "name", label: "Nombre Invitado", minWidth: 150 },
  { id: "phone", label: "Teléfono" },
  { id: "mate", label: "Acompañante" },
  { id: "status", label: "Estatus" },
  { id: "acciones", minWidth: 150 }
];

export default function GuestsList() {
  const {wedding_id} = useParams(); // obtiene el uuid_wedding de la URL
  const {guests, getGuests} = useContext(GuestsContext);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);
  const [row, setRow] = useState({});

  const openAlertConfirm = (guest) => {
    setRow(guest);
    setOpenModal(true);
  };

  const closeAlertConfirm = () => {
    setOpenModal(false);
    // opcional: refrescar lista después de eliminar
    getGuests(wedding_id);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    console.log(wedding_id);
    
    if (wedding_id) {
      getGuests(wedding_id);
    }
  }, [wedding_id]);

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <StyledTableCell key={column.id} style={{ minWidth: column.minWidth }}>
                  {column.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {guests && guests.length > 0 ? (
              guests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((guest, index) => {
                const guestName = guest.guest_lastName 
                  ? `${guest.guest_names} ${guest.guest_lastName}` 
                  : guest.guest_names;
                return (
                  <TableRow hover key={guest.uuid}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{guestName}</TableCell>
                    <TableCell>{guest.telephone}</TableCell>
                    <TableCell>{guest.mate}</TableCell>
                    <TableCell>{guest.attendance}</TableCell>
                    <TableCell>
                      <Link to={`/weddings/${guest.uuid_wedding}/guest/${guest.uuid}`}>
                        <Tooltip arrow title="Editar">
                          <Button variant="text" color="warning"><EditIcon /></Button>
                        </Tooltip>
                      </Link>
                      <Tooltip arrow title="Eliminar">
                        <Button variant="text" color="error" onClick={() => openAlertConfirm(guest)}>
                          <DeleteIcon />
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={guests ? guests.length : 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <DeleteGuestConfirm show={openModal} onHide={closeAlertConfirm} row={row} />
    </Paper>
  );
}
