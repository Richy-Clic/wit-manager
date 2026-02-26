import { useState, useEffect} from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { Paper, Table, TableBody, TableContainer, TableHead, TablePagination, TableRow, TableCell, Button, Tooltip, CircularProgress } from "@mui/material";
import { StyledTableCell } from "../styles/index.js";
import { useGuests } from "../hooks/useGuests.js";
import DeleteGuestConfirm from "../components/DeleteGuestConfirm.jsx";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { toast } from "sonner";

const columns = [
  { id: "index", label: "ID" },
  { id: "name", label: "Nombre Invitado", minWidth: 150 },
  { id: "phone", label: "Teléfono" },
  { id: "mate", label: "Invitado por" },
  { id: "attendance", label: "Asistencia" },
  { id: "acciones", minWidth: 100 }
];

export default function GuestsList() {
  const { guests, loading } = useGuests();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);
  const [row, setRow] = useState({});
  const { wedding_id } = useParams();

  const openAlertConfirm = (guest) => {
    setRow(guest);
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

  const location = useLocation();

  useEffect(() => {
    if (location.state?.status) {
      toast.success(location.state.message);
    }
  }, []);

  const getStringAttendance = (state) => {
    const states = new Map([
      [1, { label: "Confirmado", color: "white", bg: "green" }],
      [2, { label: "Pendiente", color: "black", bg: "orange" }],
      [3, { label: "Declinado", color: "white", bg: "red" }],
    ]);

    return states.get(state) || { label: "Desconocido", color: "black", bg: "gray" };
  }

  if (loading) return <CircularProgress style={{ margin: 50, display: "block", marginLeft: "auto", marginRight: "auto" }} />;
  if (!guests?.length) return <div style={{ textAlign: "center", marginTop: 50 }}>No tienes invitados registrados</div>;



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
            {guests
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((g, index) => {
                const mainGuest = g.groups?.guests?.[0];
                const mate = g.is_main
                  ? "—"
                  : mainGuest?.name ?? "—";

                return (
                  <TableRow key={g.id} hover>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{g.name}</TableCell>
                    <TableCell>{g.phone}</TableCell>
                    <TableCell>{mate}</TableCell>
                    <TableCell>
                      <mark style={{ backgroundColor: getStringAttendance(g.attendance).bg, padding: '6px 8px', borderRadius: '4px', color: getStringAttendance(g.attendance).color }}>
                        {getStringAttendance(g.attendance).label}
                      </mark>
                    </TableCell>
                    <TableCell>
                      <Link to={`/weddings/${wedding_id}/guest/${g.id}`}>
                        <Tooltip arrow title="Editar">
                          <Button variant="text" color="warning"><EditIcon /></Button>
                        </Tooltip>
                      </Link>
                      <Tooltip arrow title="Eliminar">
                        <Button variant="text" color="error" onClick={() => openAlertConfirm(g)}>
                          <DeleteIcon />
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={guests.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <DeleteGuestConfirm show={openModal} onHide={closeAlertConfirm} row={row} guests={guests} />
    </Paper>
  );
}