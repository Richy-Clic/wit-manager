import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import PropTypes from 'prop-types';  // Importar PropTypes

export const CustomizedSnackbars = ({ state, setState, message }) => {

    const handleClose = (reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setState(false);
    };

    return (
        <div>
            <Snackbar open={state} autoHideDuration={6000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
}

// Validación de las props
CustomizedSnackbars.propTypes = {
    state: PropTypes.bool.isRequired,
    setState: PropTypes.func.isRequired,
    message: PropTypes.string
};