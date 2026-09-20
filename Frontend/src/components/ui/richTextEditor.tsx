// components/ui/richTextEditor.tsx
import * as React from "react"
import ReactQuill from "react-quill-new"
import "react-quill-new/dist/quill.snow.css"
import { cn } from "@/lib/utils"

export interface RichTextEditorProps {
  label?: string
  error?: string
  containerClassName?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

const QUILL_MODULES = {
  toolbar: [["bold", "italic", "underline"], [{ list: "ordered" }, { list: "bullet" }], ["clean"]]
}

const QUILL_FORMATS = ["bold", "italic", "underline", "list"]

const RichTextEditor = React.forwardRef<ReactQuill, RichTextEditorProps>(
  ({ label, error, containerClassName, value, onChange, placeholder, disabled, className }, ref) => {
    return (
      <div className={cn("flex flex-col gap-y-2 w-full", containerClassName)}>
        {label && <label className="font-semibold text-gray-700 text-2xl">{label}</label>}

        <div
          className={cn(
            "relative border rounded-2xl bg-white transition-all overflow-hidden text-2xl text-gray-800 placeholder:text-gray-400 bg-transparentq",
            "[&_.ql-toolbar]:border-none [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-slate-200 [&_.ql-toolbar]:bg-slate-50/50",
            "[&_.ql-container]:border-none [&_.ql-container]:text-2xl [&_.ql-container]:text-gray-800",
            "[&_.ql-editor]:min-h-52 [&_.ql-editor.ql-blank::before]:text-gray-400 [&_.ql-editor.ql-blank::before]:not-italic",
            error
              ? "border-rose-500 focus-within:border-rose-600 focus-within:ring-4 focus-within:ring-rose-500/10"
              : "border-red-100 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-500/10",
            disabled ? "bg-slate-100/70 border-slate-200 cursor-not-allowed opacity-75 [&_.ql-toolbar]:hidden" : "hover:border-slate-400/80",
            className
          )}
        >
          <ReactQuill
            ref={ref}
            theme="snow"
            value={value}
            onChange={onChange}
            readOnly={disabled}
            modules={QUILL_MODULES}
            formats={QUILL_FORMATS}
            placeholder={placeholder}
          />
        </div>

        {error && <span className="text-rose-500 text-sm font-medium">{error}</span>}
      </div>
    )
  }
)

RichTextEditor.displayName = "RichTextEditor"

export { RichTextEditor }
export default RichTextEditor
