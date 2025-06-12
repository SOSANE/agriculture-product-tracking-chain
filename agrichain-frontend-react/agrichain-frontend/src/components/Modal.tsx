import {useEffect} from 'react';

const Modal = ({ title, paragraph, confirmText, cancelText, onConfirm, onCancel }: { title: string, paragraph: string, confirmText: string, cancelText: string, onConfirm: () => void, onCancel: () => void }) => {
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
                        {title}
                    </h3>
                    <p className="text-neutral-600">
                        {paragraph}
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
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="btn btn-primary min-w-[120px] bg-error hover:bg-error-dark"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;