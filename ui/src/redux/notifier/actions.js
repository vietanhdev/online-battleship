import { toast } from 'react-toastify';

export const notifierActions = {
    showMessage: (message) => {
        toast.success(toString(message));
    },
    showError: (message) => {
        toast.error(toString(message));
    },
    showInfo: (message) => {
        toast.info(toString(message));
    },
    showWarning: (message) => {
        toast.info(toString(message));
    },
    dismissAlert: () => {
        toast.dismiss();
    }
}