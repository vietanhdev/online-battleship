import { toast } from 'react-toastify';

export const notifierActions = {
    showMessage: (message) => {
        toast.success(message);
    },
    showError: (message) => {
        toast.error(message);
    },
    showInfo: (message) => {
        toast.info(message);
    },
    showWarning: (message) => {
        toast.info(message);
    },
    dismissAlert: () => {
        toast.dismiss();
    }
}