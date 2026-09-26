import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  rightElement?: React.ReactNode
  containerClassName?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, icon, rightElement, containerClassName, disabled, ...props }, ref) => {
    return (
      <div className={cn("flex flex-col gap-y-2 w-full", containerClassName)}>
        {label && <label className="font-semibold text-gray-700 text-2xl">{label}</label>}

        <div
          className={cn(
            "relative flex items-center border rounded-2xl bg-white px-4 py-3 transition-all shadow-xs",
            error
              ? "border-rose-500 focus-within:border-rose-600 focus-within:ring-4 focus-within:ring-rose-500/10"
              : "border-slate-300/80 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-500/10",
            disabled ? "bg-slate-100/70 border-slate-200 cursor-not-allowed opacity-75" : "hover:border-slate-400/80"
          )}
        >
          {icon && <div className="text-gray-400 shrink-0 mr-3.5 flex items-center">{icon}</div>}

          <input
            type={type}
            ref={ref}
            disabled={disabled}
            className={cn(
              "w-full text-2xl text-gray-800 placeholder:text-gray-400 bg-transparent outline-none border-none disabled:cursor-not-allowed",
              className
            )}
            {...props}
          />

          {rightElement && <div className="shrink-0 ml-2 flex items-center">{rightElement}</div>}
        </div>

        {error && <span className="text-rose-500 text-sm font-medium">{error}</span>}
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input }
export default Input
