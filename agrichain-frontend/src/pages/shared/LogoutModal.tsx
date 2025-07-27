import Modal from '../../components/Modal.tsx';

const LogoutModal = ({onConfirm, onCancel}: {onConfirm: () => void, onCancel: () => void}) => {
    return (
        <Modal title="Confirm Logout" paragraph="Are you sure you want to log out of your account?" confirmText="Log Out" cancelText="Cancel" onConfirm={onConfirm} onCancel={onCancel}/>
    );
};

export default LogoutModal;