import { useState, useMemo, useCallback } from "react";
import { useGuests } from "../hooks/useGuests.js";
import { useDebounce } from "../hooks/useDebounce";
import { useParams } from "react-router-dom";

import { Paper, Table, TableBody, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import { StyledTableCell } from "../styles/index.js";

import DeleteGuestConfirm from "./DeleteGuestConfirm.jsx";
import SkeletonTable from "./skeletons/STable.jsx";
import GuestRow from "./GuestRow";
import PropTypes from "prop-types";

const columns = [
  { id: "index", label: "ID" },
  { id: "name", label: "Nombre Invitado", minWidth: 150 },
  { id: "phone", label: "Teléfono" },
  { id: "mate", label: "Invitado por" },
  { id: "attendance", label: "Asistencia" },
  { id: "acciones", minWidth: 20, maxWidth: 20 }
];

const attendanceStates = new Map([
  ["confirmado", { label: "Confirmado", color: "white", bg: "green" }],
  ["pendiente", { label: "Pendiente", color: "black", bg: "orange" }],
  ["declinado", { label: "Declinado", color: "white", bg: "red" }],
]);

const GuestsList = ({ search }) => {
  const { guests, loading } = useGuests();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);
  const [row, setRow] = useState(null);
  const { wedding_id } = useParams();
  const debouncedSearch = useDebounce(search, 300);

  const filteredGuests = useMemo(() => {
    return (guests || []).filter((guest) =>
      `${guest.name} ${guest.phone} ${guest.attendance}`
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase())
    );
  }, [guests, debouncedSearch]);

  const openAlertConfirm = (guest) => {
    setRow(guest);
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

  const getStringAttendance = useCallback((state) => {
    return (
      attendanceStates.get(state) || {
        label: "Desconocido",
        color: "black",
        bg: "gray"
      }
    );
  }, []);

  if (!loading && (!guests || guests.length === 0)) return <div style={{ textAlign: "center", marginTop: 50 }}> No tienes bodas registradas </div>;
  if (!loading && (!guests || guests.length === 0)) {
    return <div style={{ textAlign: "center", marginTop: 50 }}> No tienes bodas registradas </div>;
  }
  if (!loading && !filteredGuests.length) {
    return <div style={{ textAlign: "center", marginTop: 50 }}> No se encontraron resultados </div>;
  }
  return (
    <Paper variant="card" sx={{ width: "100%" }}>
      <TableContainer sx={{ maxHeight: 520 }}>
        <Table stickyHeader size="small" aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <StyledTableCell key={column.id} style={{ minWidth: column.minWidth, maxWidth: column.maxWidth }}>
                  {column.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <SkeletonTable rows={rowsPerPage} />
            ) : (
              filteredGuests
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((g, index) => (
                  <GuestRow
                    key={g.id}
                    g={g}
                    index={index}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    wedding_id={wedding_id}
                    openAlertConfirm={openAlertConfirm}
                    getStringAttendance={getStringAttendance}
                  />
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={filteredGuests.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {row && <DeleteGuestConfirm show={openModal} onHide={closeAlertConfirm} row={row} guests={guests} />}
    </Paper>
  );
}

GuestsList.propTypes = {
  search: PropTypes.string.isRequired,
};

export default GuestsList;