import { useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { useWeddings } from "../hooks/useWeddings.js";

import { Paper, Table, Tooltip, TableBody, TableContainer, TableHead, TablePagination, TableRow, TableCell, Chip } from "@mui/material";
import { StyledTableCell } from "../styles/index.js";

import PropTypes from "prop-types";
import RowActions from "./RowActions";
import AlertConfirm from "./AlertConfirm.jsx";
import SkeletonTable from "./skeletons/STable.jsx";
import renderDateChip from "../utils/renderDateChip";

import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PeopleIcon from "@mui/icons-material/People";
import DeleteIcon from "@mui/icons-material/Delete";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ChurchIcon from "@mui/icons-material/Church";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";


const columns = [
  { id: "novios", label: "Novios", minWidth: 220 },
  { id: "fecha", label: "Fecha y Hora" },
  { id: "ubicacion", label: "Ubicación", minWidth: 70 },
  { id: "estatus", label: "Estatus", minWidth: 100 },
  { id: "acciones", minWidth: 40 },
];

const WeddingsList = ({ search }) => {
  const { weddings, loading } = useWeddings();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);
  const [row, setRow] = useState(null);
  const debouncedSearch = useDebounce(search, 300);
  const [selected, setSelected] = useState([]);

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

  const isSelected = (id) => selected.includes(id);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = filteredWeddings.map((w) => w.id);
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
    const states = new Map([
      ["en progreso", { label: "En progreso", color: "black", bg: "orange" }],
      ["finalizada", { label: "Finalizada", color: "white", bg: "green" }],
      ["cancelada", { label: "Cancelada", color: "white", bg: "red" }],
    ]);

    return states.get(state) || { label: "Desconocido", color: "black", bg: "gray" };
  }

  if (!loading && (!weddings || weddings.length === 0)) return <div style={{ textAlign: "center", marginTop: 50 }}> No tienes bodas registradas </div>;
  if (!loading && (!weddings || weddings.length === 0)) {
    return <div style={{ textAlign: "center", marginTop: 50 }}> No tienes bodas registradas </div>;
  }
  if (!loading && !filteredWeddings.length) {
    return <div style={{ textAlign: "center", marginTop: 50 }}> No se encontraron resultados </div>;
  }

  return (
    <Paper variant="card" sx={{ width: "100%" }}>
      {selected.length > 0 && (
        <Button
          color="error"
          variant="contained"
          sx={{ m: 2 }}
          onClick={() => setOpenModal(true)}
        >
          Eliminar ({selected.length})
        </Button>
      )}
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader size="small" aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selected.length > 0 && selected.length < filteredWeddings.length
                  }
                  checked={
                    filteredWeddings.length > 0 &&
                    selected.length === filteredWeddings.length
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              {columns.map((column) => (
                <StyledTableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                  {column.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <SkeletonTable rows={rowsPerPage} />
            ) : (
              filteredWeddings
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((w) => {
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
                      <TableCell>{w.boyfriend} & {w.girlfriend}</TableCell>
                      <TableCell>{renderDateChip(w.date)}</TableCell>
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

                      <TableCell align="right">
                        <RowActions
                          row={w}
                          actions={[
                            {
                              label: "Editar",
                              icon: <EditIcon fontSize="small" />,
                              to: (row) => `/weddings/${row.id}`
                            },
                            {
                              label: "Invitados",
                              icon: <PeopleIcon fontSize="small" />,
                              to: (row) => `/weddings/${row.id}/guests`
                            },
                            {
                              label: "Subir Imágenes",
                              icon: <FileUploadIcon fontSize="small" />,
                              to: (row) => `/weddings/${row.id}/pictures`
                            },
                            {
                              label: "Ver Invitación",
                              icon: <VisibilityIcon fontSize="small" />,
                              onClick: (row) => window.open(`http://localhost:5173/${row.id}`, '_blank')
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
        count={filteredWeddings.length}
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
    </Paper >
  );
}

WeddingsList.propTypes = {
  search: PropTypes.string.isRequired,
};

export default WeddingsList;
