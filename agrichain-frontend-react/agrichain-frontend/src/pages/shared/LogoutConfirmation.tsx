import {useEffect} from 'react';

interface LogoutConfirmationProps {
    onConfirm: () => void;
    onCancel: () => void;
}


const LogoutConfirmation = ({onConfirm, onCancel}: LogoutConfirmationProps) => {

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                <div className="text-center">
                    <h3 className="mb-4 text-xl font-semibold text-neutral-800">
                        Confirm Logout
                    </h3>
                    <p className="text-neutral-600">
                        Are you sure you want to log out of your account?
                    </p>
                </div>

                <div className="mt-6 flex justify-center gap-4">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onCancel();
                        }}
                        className="btn btn-outline min-w-[120px] border-neutral-300 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="btn btn-primary min-w-[120px] bg-error hover:bg-error-dark"
                    >
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogoutConfirmation;