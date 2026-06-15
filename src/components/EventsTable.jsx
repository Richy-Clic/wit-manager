import { useState } from "react";
import { useDebounce } from "../hooks/useDebounce.js";
import { useEvents } from "../hooks/useEvents.js";

import { Paper, Table, Tooltip, TableBody, TableContainer, TablePagination, TableRow, TableCell, Chip } from "@mui/material";


import { eventStates } from "../utils/states.js";
import { EventColumns } from "../utils/columns.js";
import { typeLabels } from "../utils/typeEventsLabel.js"
import { DeleteTableSection } from "./DeleteTableSection.jsx";

import PropTypes from "prop-types";
import RowActions from "./RowActions.jsx";
import AlertConfirm from "./modales/AlertConfirm.jsx";
import SkeletonTable from "./skeletons/STable.jsx";
import renderDateChip from "../utils/renderDateChip.jsx";

import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PeopleIcon from "@mui/icons-material/People";
import DeleteIcon from "@mui/icons-material/Delete";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import VisibilityIcon from '@mui/icons-material/Visibility';
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
  const [row, setRow] = useState(null);
  const debouncedSearch = useDebounce(search, 300);
  const [selected, setSelected] = useState([]);

  const filteredEvents = (events || []).filter((event) =>
    `${event.boyfriend} ${event.girlfriend} ${event.host} ${event.type_event} ${event.title_event} ${event.location} ${event.state}`
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase())
  );

  const openAlertConfirm = (event) => {
    setRow(event);
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

  const isSelected = (id) => selected.includes(id);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = filteredEvents.map((w) => w.id);
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
                .map((w) => {
                  const stateConfig = getStringState(w.state);
                  const locationURL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(w.location)}&query_place_id=${w.location_id}`;
                  const churchURL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(w.church)}&query_place_id=${w.church_id}`;
                  return (
                    <TableRow
                      key={w.id}
                      hover
                      selected={isSelected(w.id)}
                      onClick={() => handleSelectRow(w.id)}
                      sx={{ cursor: "pointer" }}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected(w.id)}
                          onClick={(e) => e.stopPropagation()}
                          onChange={() => handleSelectRow(w.id)}
                        />
                      </TableCell>
                      <TableCell>{w.title_event}</TableCell>
                      <TableCell>{typeLabels[w.type_event]}</TableCell>
                      <TableCell>{renderDateChip(w.event_date)}</TableCell>
                      <TableCell>
                        <Tooltip title={`Evento: ${w.location}`}>
                          <IconButton
                            size="small"
                            onClick={() => window.open(locationURL, "_blank")}
                          >
                            <LocationOnIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        /
                        <Tooltip title={`Ceremonia: ${w.church}`}>
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
                          row={w}
                          actions={[
                            {
                              label: "Editar",
                              icon: <EditIcon fontSize="small" />,
                              to: (row) => `/events/${row.id}`
                            },
                            {
                              label: "Invitados",
                              icon: <PeopleIcon fontSize="small" />,
                              to: (row) => `/events/${row.id}/guests`
                            },
                            {
                              label: "Subir Imágenes",
                              icon: <FileUploadIcon fontSize="small" />,
                              to: (row) => `/events/${row.id}/pictures`
                            },
                            {
                              label: "Ver Invitación",
                              icon: <VisibilityIcon fontSize="small" />,
                              onClick: (row) => window.open(`https://app.witinvitaciones.com/${row.id}/`, '_blank')
                            },
                            { divider: true },
                            {
                              label: "Eliminar",
                              icon: <DeleteIcon fontSize="small" />,
                              danger: true,
                              onClick: (row) => openAlertConfirm(row)
                            }
                          ]}
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
        (row || selected.length > 0) && (
          <AlertConfirm
            show={openModal}
            onHide={closeAlertConfirm}
            row={row}
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
