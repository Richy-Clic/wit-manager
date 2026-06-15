import { useState } from "react";
import { useDebounce } from "../hooks/useDebounce.js";
import { useEvents } from "../hooks/useEvents.js";

import { Paper, Table, Tooltip, TableBody, TableContainer, TablePagination, TableRow, TableCell, Chip } from "@mui/material";

import { eventStates } from "../utils/states.js";
import { EventColumns } from "../utils/columns.js";
import { typeLabels } from "../utils/typeEventsLabel.js"
import { DeleteTableSection } from "./DeleteTableSection.jsx";
import { getEventActions } from "../constants/eventActions.jsx";

import PropTypes from "prop-types";
import RowActions from "./RowActions.jsx";
import AlertConfirm from "./modales/AlertConfirm.jsx";
import SkeletonTable from "./skeletons/STable.jsx";
import renderDateChip from "../utils/renderDateChip.jsx";

import { IconButton } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ChurchIcon from "@mui/icons-material/Church";
import Checkbox from "@mui/material/Checkbox";
import TableHeader from "./tables/TableHeader.jsx";

import LoadingSpinner from "./LoadingSpinner.jsx";


const EventsTable = ({ search }) => {
  const { events, loadingEvents } = useEvents();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const debouncedSearch = useDebounce(search, 300);
  const [selected, setSelected] = useState([]);

  const filteredEvents = (events || []).filter((event) =>
    `${event.boyfriend} ${event.girlfriend} ${event.host} ${event.type_event} ${event.title_event} ${event.location} ${event.state}`
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase())
  );

  const openAlertConfirm = (event) => {
    setSelectedEvent(event);
    setOpenModal(true);
  };

  const closeAlertConfirm = () => {
    setOpenModal(false);
    setSelectedEvent(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const isSelected = (id) => selected.includes(id);

  const handleSelectAll = ({ target: { checked } }) => {
    setSelected(checked ? filteredEvents.map(({ id }) => id) : []);
  };

  const handleSelectRow = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const getStringState = (state) => {
    return eventStates.get(state) || { label: "Desconocido", color: "black", bg: "gray" };
  }

  if (loadingEvents) return <LoadingSpinner message="Cargando Eventos..." />
  if (!loadingEvents && (!events || events.length === 0)) return <div style={{ textAlign: "center", marginTop: 50 }}> No tienes eventos registrados </div>;
  if (!loadingEvents && !filteredEvents.length) return <div style={{ textAlign: "center", marginTop: 50 }}> No se encontraron resultados </div>;


  return (
    <Paper variant="card" sx={{ width: "100%" }}>

      <DeleteTableSection selected={selected} setOpenModal={setOpenModal} />

      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader size="small" aria-label="sticky table" >

          <TableHeader selected={selected} filteredEvents={filteredEvents} handleSelectAll={handleSelectAll} columns={EventColumns} />

          <TableBody>
            {loadingEvents ? (
              <SkeletonTable rows={rowsPerPage} />
            ) : (
              filteredEvents
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((event) => {
                  const stateConfig = getStringState(event.state);
                  const locationURL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}&query_place_id=${event.location_id}`;
                  const churchURL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.church)}&query_place_id=${event.church_id}`;
                  return (
                    <TableRow
                      key={event.id}
                      hover
                      selected={isSelected(event.id)}
                      onClick={() => handleSelectRow(event.id)}
                      sx={{ cursor: "pointer" }}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected(event.id)}
                          onClick={(e) => e.stopPropagation()}
                          onChange={() => handleSelectRow(event.id)}
                        />
                      </TableCell>
                      <TableCell>{event.title_event}</TableCell>
                      <TableCell>{typeLabels[event.type_event]}</TableCell>
                      <TableCell>{renderDateChip(event.event_date)}</TableCell>
                      <TableCell>
                        <Tooltip title={`Evento: ${event.location}`}>
                          <IconButton
                            size="small"
                            onClick={() => window.open(locationURL, "_blank")}
                          >
                            <LocationOnIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        /
                        <Tooltip title={`Ceremonia: ${event.church}`}>
                          <IconButton
                            size="small"
                            onClick={() => window.open(churchURL, "_blank")}
                          >
                            <ChurchIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={stateConfig.label}
                          size="small"
                          sx={{
                            minWidth: 90,
                            fontWeight: 600,
                            borderRadius: 2,
                            bgcolor: stateConfig.bg,
                            color: stateConfig.color,
                          }}
                        />
                      </TableCell>

                      <TableCell align="right">
                        <RowActions
                          row={event}
                          actions={getEventActions({ openAlertConfirm })}
                        />
                      </TableCell>
                    </TableRow>
                  )
                }
                ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={filteredEvents.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {
        (selectedEvent || selected.length > 0) && (
          <AlertConfirm
            show={openModal}
            onHide={closeAlertConfirm}
            event={selectedEvent}
            selected={selected}
          />
        )
      }
    </Paper>
  );
}

EventsTable.propTypes = {
  search: PropTypes.string.isRequired,
};

export default EventsTable;
