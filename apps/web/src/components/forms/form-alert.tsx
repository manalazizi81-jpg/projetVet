import { CheckCircle2, CircleAlert } from "lucide-react";

export function FormAlert({ variant, children }: { variant: "success" | "error"; children: React.ReactNode }) {
  const Icon = variant === "success" ? CheckCircle2 : CircleAlert;
  return (
    <div className={`form-alert form-alert-${variant}`} role={variant === "error" ? "alert" : "status"}>
      <span className="form-alert-icon"><Icon size={20} aria-hidden="true" /></span>
      <span>{children}</span>
    </div>
  );
}
