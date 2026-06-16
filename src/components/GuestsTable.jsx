import { useState, useMemo } from "react";
import { useGuests } from "../hooks/useGuests.js";
import { useDebounce } from "../hooks/useDebounce.js";
import { useParams } from "react-router-dom";

import { Paper, Table, TableBody, TableContainer, TablePagination } from "@mui/material";
import { DeleteTableSection } from "./DeleteTableSection.jsx";

import DeleteGuestConfirm from "./modales/DeleteGuestConfirm.jsx";
import SkeletonTable from "./skeletons/STable.jsx";
import GuestRow from "./tables/GuestRow.jsx";
import PropTypes from "prop-types";
import { guestColumns } from "../utils/columns.js";
import TableHeader from "./tables/TableHeader.jsx";

const GuestsTable = ({ search }) => {
  const { guests, loading } = useGuests();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);
  const [row, setRow] = useState(null);
  const { event_id } = useParams();
  const debouncedSearch = useDebounce(search, 300);
  const [selected, setSelected] = useState([]);

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
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const isSelected = (id) => selected.includes(id);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = filteredGuests.map((g) => g.id);
      setSelected(newSelected);
    } else {
      setSelected([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };
    console.log("desde guesttable", guests);
    

  if (!loading && (!guests || guests.length === 0)) return <div style={{ textAlign: "center", marginTop: 50 }}> No tienes invitados registrados </div>;
  if (!loading && (!guests || guests.length === 0)) {
    return <div style={{ textAlign: "center", marginTop: 50 }}> No tienes invitados registrados </div>;
  }
  if (!loading && !filteredGuests.length) {
    return <div style={{ textAlign: "center", marginTop: 50 }}> No se encontraron resultados </div>;
  }
  return (
    <Paper variant="card" sx={{ width: "100%" }}>
     
      <DeleteTableSection selected={selected} setOpenModal={setOpenModal} />
      <TableContainer sx={{ maxHeight: 520 }}>
        <Table stickyHeader size="small" aria-label="sticky table">

          <TableHeader selected={selected} filteredEvents={filteredGuests} handleSelectAll={handleSelectAll} columns={guestColumns} />

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
                    event_id={event_id}
                    openAlertConfirm={openAlertConfirm}
                    isSelected={isSelected}
                    handleSelectRow={handleSelectRow}
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
      <DeleteGuestConfirm show={openModal}
        onHide={closeAlertConfirm}
        row={row}
        guests={guests}
        selected={selected} />
    </Paper>
  );
}

GuestsTable.propTypes = {
  search: PropTypes.string.isRequired,
};

export default GuestsTable;