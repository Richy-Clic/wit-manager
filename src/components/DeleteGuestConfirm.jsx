import React from 'react';
import PropTypes from 'prop-types';
import { useGuests } from "../hooks/useGuests.js";
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { toast } from 'sonner';

export default function DeleteGuestConfirm(props) {
  const { deleteGuest } = useGuests();

  const handleDelete = async () => {
    try {
      await deleteGuest(props.row.id);
      toast.success("Invitado eliminado con éxito");
      props.onHide();
    } catch (error) {
      toast.error("Error al eliminar el invitado: " + error.message);
    }
  }

  return (
    <React.Fragment>
      <Dialog
        open={props.show}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Atención!"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            De verdad deseas eliminar a {props.row.guest_names} {props.row.guest_lastNames}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onHide}>Cancelar</Button>
          <Button onClick={handleDelete} autoFocus color={'error'} variant='contained'>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

// Define la validación de props
DeleteGuestConfirm.propTypes = {
  show: PropTypes.bool.isRequired, // Asegúrate de que 'show' sea un booleano y sea requerido
  onHide: PropTypes.func.isRequired, // Asegúrate de que 'onHide' sea una función y sea requerida
  row: PropTypes.object.isRequired,
};
