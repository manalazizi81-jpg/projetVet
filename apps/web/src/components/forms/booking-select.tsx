"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

type Option = { value: string; label: string; disabled?: boolean };

export function BookingSelect({
  label,
  value,
  options,
  onChange,
  disabled = false,
  placeholder = "Choisir",
}: {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const labelId = useId();
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [open]);

  return (
    <div className="booking-select-field" ref={rootRef} onKeyDown={(event) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }}>
      <span className="booking-select-label" id={labelId}>{label}</span>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        className={`booking-select-trigger${open ? " is-open" : ""}`}
        aria-labelledby={labelId}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span data-no-translate className={selected ? "" : "booking-select-placeholder"}>{selected?.label ?? placeholder}</span>
        <ChevronDown size={18} aria-hidden="true" />
      </button>
      {open && <div className="booking-select-menu" aria-label={label}>
        {options.map((option) => <button
          key={option.value}
          type="button"
          disabled={option.disabled}
          className={`booking-select-option${option.value === value ? " is-selected" : ""}`}
          onClick={() => {
            onChange(option.value);
            setOpen(false);
            triggerRef.current?.focus();
          }}
        >
          {option.label}
          {option.value === value && <Check size={16} aria-hidden="true" />}
        </button>)}
      </div>}
    </div>
  );
}
