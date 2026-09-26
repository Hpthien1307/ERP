import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

export interface SelectOption {
  value: string | number
  label: string
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  options?: SelectOption[]
  containerClassName?: string
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, icon, options = [], children, containerClassName, disabled, ...props }, ref) => {
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

          <select
            ref={ref}
            disabled={disabled}
            className={cn(
              "w-full text-2xl text-gray-800 bg-transparent outline-none border-none appearance-none cursor-pointer disabled:cursor-not-allowed pr-8",
              className
            )}
            {...props}
          >
            {options.length > 0
              ? options.map(opt => (
                  <option key={opt.value} value={opt.value} className="text-gray-800 bg-white py-2">
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          <ChevronDown className="w-5 h-5 text-gray-400 absolute right-4 pointer-events-none" />
        </div>

        {error && <span className="text-rose-500 text-sm font-medium">{error}</span>}
      </div>
    )
  }
)

Select.displayName = "Select"

export { Select }
export default Select
