import { toast } from 'react-toastify';

export const showToast = (type, message) => {
    switch (type) {
        case 'success':
            toast.success(message, { position: "top-center", autoClose: 2000 });
            break;
        case 'error':
            toast.error(message, { position: "top-center", autoClose: 2000 });
            break;
        default:
            toast(message, { position: "top-center", autoClose: 2000 });
    }
};
