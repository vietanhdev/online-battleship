import { toast } from 'react-toastify';

export const notifierActions = {
    showMessage: (message) => dispatch => {
        toast.success(message);
    },
    showError: (message) => dispatch => {
        toast.error(message);
    },
    showInfo: (message) => dispatch => {
        toast.info(message);
    },
    showWarning: (message) => dispatch => {
        toast.info(message);
    },
    dismissAlert: (message) => dispatch => {
        toast.dismiss();
    }
}