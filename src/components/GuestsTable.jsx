
import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

import {
  Box,
  Checkbox,
  Divider,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { useParams } from "react-router-dom";

import DeleteGuestConfirm from "./modales/DeleteGuestConfirm.jsx";
import SkeletonTable from "./skeletons/STable.jsx";
import GuestRow from "./tables/GuestRow.jsx";
import TableHeader from "./tables/TableHeader.jsx";
import { DeleteTableSection } from "./DeleteTableSection.jsx";
import { guestColumns } from "../utils/columns.js";
import { getStringAttendance } from "../utils/guestUtils.js";
import { getGuestActions } from "../constants/guestActions.jsx";
import RowActions from "./RowActions.jsx";
import ChipState from "./ChipState.jsx";

import { toast } from "sonner";
import supabase from "../lib/supabaseClient.js";

const FUNCTION_URL =
  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-bulk-whatsapp`;

const GuestsTable = ({
  guests,
  loading,
  search,
  attendanceFilter,
  selected,
  setSelected,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { event_id } = useParams();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [openModal, setOpenModal] = useState(false);

  const debouncedSearch = search.trim().toLowerCase();

  const [sending, setSending] = useState(false);

  const handleSendWhatsApp = async () => {
    const guestsToSend = guests.filter((guest) =>
      selected.includes(guest.id)
    );

    if (!guestsToSend.length) return;

    if (
      !window.confirm(
        `¿Enviar WhatsApp a ${guestsToSend.length} invitados seleccionados?`
      )
    ) {
      return;
    }

    try {
      setSending(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast.error("Sesión expirada");
        return;
      }

      const response = await fetch(FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ guests: guestsToSend }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error enviando mensajes");
      }

      const successCount =
        data.results.filter((result) => result.success).length;

      toast.success(`${successCount} mensajes enviados`);
      setSelected([]);
    } catch (error) {
      console.error(error);
      toast.error("Error al enviar mensajes");
    } finally {
      setSending(false);
    }
  };

  const filteredGuests = useMemo(() => {
    return (guests || []).filter((guest) => {
      const searchableText = `${guest.name || ""} ${guest.phone || ""
        } ${guest.attendance || ""}`.toLowerCase();

      const matchesSearch = searchableText.includes(debouncedSearch);

      const matchesAttendance =
        attendanceFilter === "all" ||
        guest.attendance === attendanceFilter;

      return matchesSearch && matchesAttendance;
    });
  }, [guests, debouncedSearch, attendanceFilter]);

  const isAllSelected =
    filteredGuests.length > 0 &&
    filteredGuests.every((guest) => selected.includes(guest.id));

  const isIndeterminate =
    filteredGuests.some((guest) => selected.includes(guest.id)) &&
    !isAllSelected;

  useEffect(() => {
    setPage(0);
  }, [search, attendanceFilter]);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const visibleIds = filteredGuests.map((guest) => guest.id);

      setSelected((previous) =>
        [...new Set([...previous, ...visibleIds])]
      );
    } else {
      const visibleIds = new Set(filteredGuests.map((guest) => guest.id));

      setSelected((previous) =>
        previous.filter((id) => !visibleIds.has(id))
      );
    }
  };

  const handleSelectRow = (id) => {
    setSelected((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  // const openDeleteModal = () => {
  //   if (selected.length > 0) {
  //     setOpenModal(true);
  //   }
  // };

  const closeDeleteModal = () => {
    setOpenModal(false);
    setSelected([]);
  };

  const visibleGuests = filteredGuests.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (!loading && (!guests || guests.length === 0)) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          textAlign: "center",
          borderRadius: 3,
          border: "1px dashed",
          borderColor: "divider",
        }}
      >
        <Typography fontWeight={600}>
          Aún no tienes invitados
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          Agrega un invitado o importa tu lista para comenzar.
        </Typography>
      </Paper>
    );
  }

  if (!loading && filteredGuests.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          textAlign: "center",
          borderRadius: 3,
          border: "1px dashed",
          borderColor: "divider",
        }}
      >
        <Typography fontWeight={600}>
          No encontramos invitados
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          Intenta con otra búsqueda o categoría.
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      {/* Acciones de selección */}
      {selected.length > 0 && (
        <Box mb={1.5}>
          <DeleteTableSection
            selected={selected}
            setOpenModal={setOpenModal}
            onSendWhatsApp={handleSendWhatsApp}
            sending={sending}
          />
        </Box>
      )}

      {/* Desktop */}
      {!isMobile ? (
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
          }}
        >
          <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
            <Table stickyHeader size="medium" aria-label="Lista de invitados">
              <TableHeader
                selected={selected}
                filteredEvents={filteredGuests}
                handleSelectAll={handleSelectAll}
                columns={guestColumns}
                isAllSelected={isAllSelected}
                isIndeterminate={isIndeterminate}
              />

              <TableBody>
                {loading ? (
                  <SkeletonTable rows={rowsPerPage} />
                ) : (
                  visibleGuests.map((guest, index) => (
                    <GuestRow
                      key={guest.id}
                      g={guest}
                      index={index}
                      page={page}
                      rowsPerPage={rowsPerPage}
                      event_id={event_id}
                      isSelected={() => selected.includes(guest.id)}
                      handleSelectRow={handleSelectRow}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={filteredGuests.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por página:"
          />
        </Paper>
      ) : (
        /* Mobile */
        <Paper
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          {/* Seleccionar todos los resultados filtrados */}
          <Box
            display="flex"
            alignItems="center"
            px={1.5}
            py={1}
          >
            <Checkbox
              size="small"
              checked={isAllSelected}
              indeterminate={isIndeterminate}
              onChange={handleSelectAll}
              disabled={loading || filteredGuests.length === 0}
            />
            <Typography variant="body2" color="text.secondary">
              Seleccionar todos ({filteredGuests.length})
            </Typography>
          </Box>

          <Divider />

          {loading ? (
            <Box>
              {Array.from({ length: rowsPerPage }).map((_, index) => (
                <Box
                  key={index}
                  display="flex"
                  alignItems="center"
                  gap={1.5}
                  px={1.5}
                  py={1.25}
                >
                  <Skeleton variant="circular" width={40} height={40} />

                  <Box flex={1}>
                    <Skeleton variant="text" width="65%" />
                    <Skeleton variant="text" width="35%" />
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            visibleGuests.map((guest) => {
              const attendance = getStringAttendance(guest);

              const actions = getGuestActions({
                guest,
                eventId: event_id,
                sending: false,
                handleSend: async () => { },
                openAlertConfirm: () => { },
              }).filter(
                (action) =>
                  !action.danger &&
                  !String(action.label || "").toLowerCase().includes("eliminar")
              );

              return (
                <Box key={guest.id}>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    px={1.5}
                    py={1.25}
                  >
                    <Checkbox
                      size="small"
                      checked={selected.includes(guest.id)}
                      onChange={() => handleSelectRow(guest.id)}
                    />

                    <Box flex={1} minWidth={0}>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        noWrap
                      >
                        {guest.name}
                      </Typography>

                      <Box mt={0.5}>
                        <ChipState state={attendance} />
                      </Box>
                    </Box>

                    <RowActions
                      row={guest}
                      actions={actions}
                    />
                  </Box>
                  <Divider />
                </Box>
              );
            })
          )}

          <TablePagination
            component="div"
            count={filteredGuests.length}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[10, 25, 50]}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Por página:"
          />
        </Paper>
      )}

      <DeleteGuestConfirm
        show={openModal}
        onHide={closeDeleteModal}
        row={null}
        guests={guests}
        selected={selected}
      />
    </>
  );
};

GuestsTable.propTypes = {
  guests: PropTypes.array,
  loading: PropTypes.bool,
  search: PropTypes.string.isRequired,
  attendanceFilter: PropTypes.string.isRequired,
  selected: PropTypes.array.isRequired,
  setSelected: PropTypes.func.isRequired,
};

export default GuestsTable;
