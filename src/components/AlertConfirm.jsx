import React from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { useWeddings } from "../hooks/useWeddings.js";
import { toast } from "sonner";

export default function AlertConfirm(props) {
  const { deleteWedding } = useWeddings();

  const handleDelete = async () => {
    try {
      await deleteWedding(props.row.id);
      toast.success("Boda eliminada con éxito");
      props.onHide();
    } catch (error) {
      toast.error("Error al eliminar la boda: " + error.message);
    }
  }
  console.log(props);
  
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
            De verdad deseas eliminar la boda de {props.row.boyfriend} & {props.row.girlfriend} ?
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
  row: PropTypes.object.isRequired
};
