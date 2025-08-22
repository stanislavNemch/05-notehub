import { useEffect } from "react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";

// Знаходимо DOM-елемент, куди будемо монтувати модальне вікно.
const modalRoot = document.body;

// Інтерфейс для пропсів компонента Modal.
interface ModalProps {
    // Визначає, чи є модальне вікно відкритим.
    isOpen: boolean;
    // Функція для закриття модального вікна.
    onClose: () => void;
    // Дочірні елементи, що будуть відображатися всередині модального вікна.
    children: React.ReactNode;
}

/**
 * Універсальний компонент модального вікна.
 * @param {ModalProps} props - Пропси компонента.
 * @returns {React.ReactPortal | null} - Портал з модальним вікном або null.
 */
const Modal = ({
    isOpen,
    onClose,
    children,
}: ModalProps): React.ReactPortal | null => {
    // Ефект для обробки натискання клавіші Escape.
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
        }

        // Прибираємо обробник події при розмонтуванні компонента або при зміні стану.
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    // Обробник кліку по бекдропу для закриття модального вікна.
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) {
        return null;
    }

    // Використовуємо createPortal для рендерингу модального вікна поза основним DOM-деревом.
    return createPortal(
        <div
            className={css.backdrop}
            role="dialog"
            aria-modal="true"
            onClick={handleBackdropClick}
        >
            <div className={css.modal}>{children}</div>
        </div>,
        modalRoot
    );
};

export default Modal;
