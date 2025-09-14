import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableCell,
  Button,
  Tooltip,
  CircularProgress
} from "@mui/material";
import { StyledTableCell } from "../styles/index.js";
import DeleteGuestConfirm from "../components/DeleteGuestConfirm.jsx";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import supabase from "../lib/supabaseClient";

const columns = [
  { id: "index", label: "ID" },
  { id: "name", label: "Nombre Invitado", minWidth: 150 },
  { id: "phone", label: "Teléfono" },
  { id: "mate", label: "Acompañante" },
  { id: "attendance", label: "Asistencia" },
  { id: "acciones", minWidth: 100 }
];

export default function GuestsList() {
  const { wedding_id } = useParams();
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);
  const [row, setRow] = useState({});

  const fetchGuests = async () => {
    if (!wedding_id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("guests")
        .select("*")
        .eq("wedding_id", wedding_id);

      if (error) throw error;
      setGuests(data || []);
    } catch (err) {
      console.error("Error fetching guests:", err);
      setGuests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, [wedding_id]);

  const openAlertConfirm = (guest) => {
    setRow(guest);
    setOpenModal(true);
  };

  const closeAlertConfirm = () => {
    setOpenModal(false);
    fetchGuests();
  };

  const getStringAttendance = (state) => {
    const states = new Map([
      [1, { label: "Pending", color: "black", bg: "orange" }],
      [2, { label: "Confirmed", color: "white", bg: "green" }],
      [3, { label: "Declined", color: "white", bg: "red" }],
    ]);

    return states.get(state) || { label: "Desconocido", color: "black", bg: "gray" };
  }

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const paginatedGuests = useMemo(() => {
    return guests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [guests, page, rowsPerPage]);

  if (loading)
    return <CircularProgress style={{ margin: 50, display: "block", marginLeft: "auto", marginRight: "auto" }} />;
  if (!guests.length)
    return <div style={{ textAlign: "center", marginTop: 50 }}>No hay invitados registrados</div>;

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
            {paginatedGuests.map((g, index) => (
              <TableRow hover key={g.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{g.name}</TableCell>
                <TableCell>{g.phone}</TableCell>
                <TableCell>{g.mate}</TableCell>
                <TableCell>
                  <mark style={{ backgroundColor: getStringAttendance(g.attendance).bg, padding: '6px 8px', borderRadius: '4px', color: getStringAttendance(g.attendance).color }}>
                    {getStringAttendance(g.attendance).label}
                  </mark>
                </TableCell>
                <TableCell>
                  <Link to={`/weddings/${wedding_id}/guest/${g.uuid}`}>
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
            ))}
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
      <DeleteGuestConfirm show={openModal} onHide={closeAlertConfirm} row={row} />
    </Paper>
  );
}
