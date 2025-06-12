import Modal from '../../components/Modal.tsx';

const LogoutModal = ({onConfirm, onCancel}: LogoutConfirmationProps) => {
    return (
        <Modal title="Confirm Logout" paragrah="Are you sure you want to log out of your account?" confirmText="Log Out" cancelText="Cancel" onConfirm={onConfirm} onCancel={onCancel}/>
    );
};

export default LogoutModal;