import { useRef, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    className?: string;
    children: React.ReactNode;
    showCloseButton?: boolean;
    isFullscreen?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    children,
    className = "",
    showCloseButton = true,
    isFullscreen = false
}) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const contentClasses = isFullscreen
        ? "w-full h-full min-h-dvh overflow-y-auto bg-white dark:bg-gray-900 p-4 sm:p-6"
        : `relative w-full max-h-[92vh] overflow-y-auto rounded-3xl bg-white dark:bg-gray-900 p-4 sm:p-6 shadow-2xl border border-gray-200/80 dark:border-gray-800 ${className}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 overflow-y-auto overscroll-contain">
            {/* Backdrop */}
            <div
                className="fixed inset-0 size-full bg-black/60 backdrop-blur-xs transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Dialog Content */}
            <div
                ref={modalRef}
                className={`relative z-10 custom-scrollbar ${contentClasses}`}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                {showCloseButton && (
                    <button
                        onClick={onClose}
                        className="absolute right-3.5 top-3.5 z-20 flex size-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition"
                        aria-label="Close dialog"
                    >
                        <XMarkIcon className="size-5" />
                    </button>
                )}
                <div className="w-full">{children}</div>
            </div>
        </div>
    );
};

export default Modal;
