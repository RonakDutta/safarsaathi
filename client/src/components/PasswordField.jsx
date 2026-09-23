import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

function PasswordField({ id, value, onChange, autoComplete, placeholder }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="group relative">
      <Lock
        size={17}
        className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-mute transition-colors duration-200 group-focus-within:text-amber"
      />
      <input
        id={id}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="field pr-12 pl-11"
        value={value}
        onChange={onChange}
        required
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute inset-y-1.5 right-1.5 flex w-10 items-center justify-center rounded-lg text-mute transition-colors duration-200 hover:bg-white/5 hover:text-white"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

export default PasswordField;
