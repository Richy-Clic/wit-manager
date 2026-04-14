import React from 'react';
import PropTypes from 'prop-types';
import { useGuests } from "../hooks/useGuests.js";
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { toast } from 'sonner';

export default function DeleteGuestConfirm(props) {
  const { deleteGuest } = useGuests();

  const isBulk = props.selected?.length > 0;

  const handleDelete = async () => {
    try {
      if (isBulk) {
        // validar múltiples
        const invalid = props.selected.some((id) => {
          const guest = props.guests.find(g => g.id === id);
          const guestIsMain = guest?.is_main;

          const hasSubGuests = props.guests.some(g =>
            g.group_id === guest?.group_id &&
            g.id !== guest?.id
          );

          return guestIsMain && hasSubGuests;
        });

        if (invalid) {
          toast.error("Uno o más invitados principales tienen acompañantes.");
          props.onHide();
          return;
        }

        // delete en loop o bulk (mejor bulk si lo tienes)
        await Promise.all(props.selected.map(id => deleteGuest(id)));

        toast.success(`${props.selected.length} invitados eliminados`);
      } else {
        const guestIsMain = props.row.is_main;

        const hasSubGuests = props.guests.some(g =>
          g.group_id === props.row.group_id &&
          g.id !== props.row.id
        );

        if (guestIsMain && hasSubGuests) {
          toast.error("No se puede eliminar un invitado principal con acompañantes.");
          props.onHide();
          return;
        }

        await deleteGuest(props.row.id);
        toast.success("Invitado eliminado con éxito");
      }

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
          <DialogContentText>
            {isBulk
              ? `¿Deseas eliminar ${props.selected.length} invitados?`
              : `¿De verdad deseas eliminar a ${props.row?.name}?`}
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
  guests: PropTypes.array.isRequired,
  row: PropTypes.object,
  selected: PropTypes.array
};
