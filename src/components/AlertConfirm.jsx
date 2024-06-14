import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import axios from "axios";
import { WeddingsContext } from "../context/WeddingsProvider";

export default function AlertConfirm(props) {
  const {getWeddings} = useContext(WeddingsContext)

  const handleDelete = async () => {
    try {
      
        await axios({
            method: 'delete',
            url: `http://localhost:3001/weddings/${props.row.uuid}`,
        })
        getWeddings();
        props.onHide();

    } catch (error) {
      console.log('Error al intentar eliminar la boda', error);
    }
  }

  return (
    <React.Fragment>
      
      <Dialog
        open={props.show}
        // onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        
      >
        <DialogTitle id="alert-dialog-title">
          {"Atención!"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          De verdad deseas eliminar la boda de {props.row.boyfriend_name} & {props.row.girlfriend_name} ?
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
  row: PropTypes.object.isRequired,
};
