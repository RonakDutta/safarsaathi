import { useEffect } from "react";
import { X } from "lucide-react";

function Dialog({ open, onClose, title, description, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-0 sm:items-center sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className="animate-rise w-full max-w-md rounded-t-xl border border-line bg-panel p-6 sm:rounded-xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="dialog-title" className="text-xl font-semibold text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="-mt-1 -mr-2 p-2 text-mute transition-colors hover:text-white"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-mute">{description}</p>
        )}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Keep it",
}) {
  return (
    <Dialog open={open} onClose={onClose} title={title} description={description}>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button onClick={onClose} className="btn-secondary">
          {cancelLabel}
        </button>
        <button
          onClick={onConfirm}
          className="btn bg-danger text-white hover:bg-danger/85"
        >
          {confirmLabel}
        </button>
      </div>
    </Dialog>
  );
}

export default Dialog;
