import React from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { useEvents } from "../../hooks/useEvents.js";
import { toast } from "sonner";

export default function AlertConfirm(props) {
  const {deleteEvent} = useEvents();


  const handleDelete = async () => {
    try {
      await deleteEvent(props.event.id);
      toast.success("Evento eliminada con éxito");

      props.onHide();
    } catch (error) {
      toast.error("Error al eliminar: " + error.message);
    }
  };

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
            {`¿De verdad deseas eliminar el evento de ${props.event.title_event}?`}
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
AlertConfirm.propTypes = {
  show: PropTypes.bool.isRequired, // Asegúrate de que 'show' sea un booleano y sea requerido
  onHide: PropTypes.func.isRequired, // Asegúrate de que 'onHide' sea una función y sea requerida
  event: PropTypes.object
};
