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
      className="animate-fade fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className="sheet-sm w-full max-w-md rounded-t-[2rem] border border-white/[0.08] bg-panel px-5 pt-3 shadow-2xl sm:rounded-[2rem] sm:p-8"
      >
        <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-white/15 sm:hidden" />
        <div className="flex items-start justify-between gap-4">
          <h2
            id="dialog-title"
            className="text-xl font-bold tracking-tight text-white sm:text-2xl"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="-mt-1 -mr-2 flex h-10 w-10 items-center justify-center rounded-full text-mute transition-[color,background-color,transform] duration-300 hover:rotate-90 hover:bg-white/5 hover:text-white"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-mute">
            {description}
          </p>
        )}
        <div className="mt-6 pb-6 sm:pb-0">{children}</div>
        <div className="pb-safe sm:hidden" />
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
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      description={description}
    >
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button onClick={onClose} className="btn-secondary py-3.5">
          {cancelLabel}
        </button>
        <button
          onClick={onConfirm}
          className="btn bg-danger py-3.5 text-white hover:bg-danger/85"
        >
          {confirmLabel}
        </button>
      </div>
    </Dialog>
  );
}

export default Dialog;
