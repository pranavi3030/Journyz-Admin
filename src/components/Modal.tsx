import { createPortal } from "react-dom";
import { ReactNode, useEffect } from "react";

interface ModalProps {
  open: boolean;
  children: ReactNode;
  onClose: () => void;
  size: "small" | "medium" | "large" | "extra-large";
}

const Modal = ({ open, children, onClose, size }: ModalProps) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  if (!open) return null;
  return createPortal(
    <div className="portal">
      <div
        className="overlay fixed top-0 left-0 right-0 bottom-0 bg-black/70 z-10"
        onClick={onClose}
      ></div>
      <div
        className={`${
          size == "small"
            ? "w-1/2"
            : size == "medium"
            ? "w-2/3"
            : size == "large"
            ? "w-3/4"
            : "w-4/5"
        } modal fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-white p-10 z-10 max-h-[90vh] overflow-y-scroll rounded`}
      >
        <button className="fixed top-2 right-4 text-2xl p-0" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
