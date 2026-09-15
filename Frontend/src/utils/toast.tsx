import { toast } from "sonner"
import { CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react"

const baseStyle: React.CSSProperties = {
  fontFamily: "inherit",
  borderRadius: "8px",
  padding: "12px 16px",
  fontSize: "14px",
  fontWeight: 500,
  lineHeight: "1.4",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
  display: "flex",
  alignItems: "center",
  gap: "6px"
}

export const showToast = {
  success: (msg: string) =>
    toast.success(msg, {
      position: "top-right",
      duration: 3500,
      style: {
        ...baseStyle,
        background: "#f0fdf4",
        color: "#15803d",
        border: "1px solid #bbf7d0"
      },
      icon: <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
    }),

  error: (msg: string) =>
    toast.error(msg, {
      position: "top-right",
      duration: 4000,
      style: {
        ...baseStyle,
        background: "#fef2f2",
        color: "#b91c1c",
        border: "1px solid #fecaca"
      },
      icon: <AlertCircle className="w-8 h-8 text-red-600 shrink-0" />
    }),

  warning: (msg: string) =>
    toast.warning(msg, {
      position: "top-right",
      duration: 3500,
      style: {
        ...baseStyle,
        background: "#fffbeb",
        color: "#b45309",
        border: "1px solid #fde68a"
      },
      icon: <AlertTriangle className="w-8 h-8 text-amber-600 shrink-0" />
    }),

  info: (msg: string) =>
    toast.info(msg, {
      position: "top-right",
      duration: 3500,
      style: {
        ...baseStyle,
        background: "#eff6ff",
        color: "#1d4ed8",
        border: "1px solid #bfdbfe"
      },
      icon: <Info className="w-8 h-8 text-blue-600 shrink-0" />
    })
}
