import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import PropTypes from 'prop-types';  // Importar PropTypes

export const CustomizedSnackbars = ({ snackbar, setSnackbar}) => {

    const handleClose = (reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbar({ ...setSnackbar, open: false });
    };
    
    return (
        <div>
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity={snackbar.severity || "info"}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
}

// Validación de las props
CustomizedSnackbars.propTypes = {
    snackbar: PropTypes.shape({
        open: PropTypes.bool.isRequired,
        message: PropTypes.string.isRequired,
        severity: PropTypes.oneOf(['success', 'info', 'warning', 'error']).isRequired,
    }).isRequired,
    setSnackbar: PropTypes.func.isRequired,
};