import { TableRow, TableCell, Button, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import React from "react";
import PropTypes from "prop-types";

const GuestRow = ({
  g,
  index,
  page,
  rowsPerPage,
  wedding_id,
  openAlertConfirm,
  getStringAttendance
}) => {
  const mainGuest = g.groups?.guests?.[0];
  const attendance = getStringAttendance(g.attendance);
  const mate = g.is_main
    ? "—"
    : mainGuest?.name ?? "—";

  const sendMessage = (guest) => {

    alert(`Enviar mensaje a ${guest.name} (${guest.phone})`);
  }

  

  return (
    <TableRow hover>
      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
      <TableCell>{g.name}</TableCell>
      <TableCell>{g.phone}</TableCell>
      <TableCell>{mate}</TableCell>
      <TableCell>
        <mark
          style={{
            backgroundColor: attendance.bg,
            padding: "6px 8px",
            borderRadius: "4px",
            color: attendance.color
          }}
        >
          {attendance.label}
        </mark>
      </TableCell>
      <TableCell>
        <Link to={`/weddings/${wedding_id}/guest/${g.id}`}>
          <Tooltip arrow title="Editar">
            <Button variant="text" color="warning">
              <EditIcon />
            </Button>
          </Tooltip>
        </Link>
        <Tooltip arrow title="Eliminar">
          <Button
            variant="text"
            color="error"
            onClick={() => openAlertConfirm(g)}
          >
            <DeleteIcon />
          </Button>
        </Tooltip>
         <Tooltip arrow title="Enviar mensaje">
          <Button
            variant="text"
            color="success"
            onClick={() => sendMessage(g)}
          >
            <WhatsAppIcon />
          </Button>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

GuestRow.propTypes = {
  g: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  wedding_id: PropTypes.string.isRequired,
  openAlertConfirm: PropTypes.func.isRequired,
  getStringAttendance: PropTypes.func.isRequired
};

const MemoizedGuestRow = React.memo(GuestRow);
export default MemoizedGuestRow;