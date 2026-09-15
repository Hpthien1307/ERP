import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  containerClassName?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, containerClassName, disabled, rows = 4, ...props }, ref) => {
    return (
      <div className={cn("flex flex-col gap-y-2 w-full", containerClassName)}>
        {label && <label className="font-semibold text-gray-700 text-2xl">{label}</label>}

        <div
          className={cn(
            "relative flex border rounded-2xl bg-white p-4 transition-all shadow-xs",
            error
              ? "border-rose-500 focus-within:border-rose-600 focus-within:ring-4 focus-within:ring-rose-500/10"
              : "border-slate-300/80 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-500/10",
            disabled ? "bg-slate-100/70 border-slate-200 cursor-not-allowed opacity-75" : "hover:border-slate-400/80"
          )}
        >
          <textarea
            ref={ref}
            rows={rows}
            disabled={disabled}
            className={cn(
              "w-full text-2xl text-gray-800 placeholder:text-gray-400 bg-transparent outline-none border-none resize-y disabled:cursor-not-allowed",
              className
            )}
            {...props}
          />
        </div>

        {error && <span className="text-rose-500 text-sm font-medium">{error}</span>}
      </div>
    )
  }
)

Textarea.displayName = "Textarea"

export { Textarea }
export default Textarea
