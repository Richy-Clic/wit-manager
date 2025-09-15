import React from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
// import supabase from '../lib/supabaseClient';

export default function DeleteGuestConfirm(props) {
  const handleDelete = async () => {
    try {
      
      
      // const { error } = await supabase
      //   .from("guests")
      //   .delete()
      //   .eq("uuid", uuid);

      // if (!error) setGuests((prev) => prev.filter((g) => g.uuid !== uuid));
      props.onHide();
    } catch (error) {
      console.log('Error al intentar eliminar al invitado', error);
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
