import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"
import { Loader2 } from "lucide-react"

type BtnVariantProps = "default" | "primary" | "white" | "center" | "error" | "success"
type BtnSizeProps = "default" | "large"

type BtnProps = {
  text: string
  variant: BtnVariantProps
  href: string
  classCustom: string
  size: BtnSizeProps
  children: React.ReactNode
  loading: boolean
  disabled: boolean
  buttonProps: React.ComponentPropsWithoutRef<"button">
  linkProps: React.ComponentPropsWithRef<"a">
}

type BtnOptional = Partial<BtnProps>

const btnVariants = cva(
  "group flex justify-center items-center gap-x-2.5 font-semibold px-[1.4rem] py-[0.4rem] w-fit max-w-full relative z-2 rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 ease-in",
  {
    variants: {
      variant: {
        default: "bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-50",
        primary:
          "bg-[var(--color-pri)] border border-[var(--color-pri)] text-white hover:bg-[var(--color-pri-hover)] hover:border-[var(--color-pri-hover)] shadow-lg shadow-blue-500/25 active:scale-[0.99]",
        white: "bg-white border border-white text-[var(--color-pri)] hover:bg-[var(--color-pri)] hover:text-white",
        center: "mx-auto",
        error: "bg-rose-600 hover:bg-rose-700 text-white",
        success: "bg-green-600 hover:bg-green-700 text-white"
      },
      size: {
        default: "h-[4.2rem] px-[1.8rem] text-xl",
        large: "h-[4.8rem] px-[2rem] py-[0.5rem] text-2xl"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

const Btn = ({ text, variant = "default", href, classCustom, size = "default", children, loading, disabled, buttonProps, linkProps }: BtnOptional) => {
  const disabledClass = loading || disabled ? "opacity-75 cursor-not-allowed pointer-events-none" : ""

  if (href) {
    return (
      <Link to={href} className={cn(btnVariants({ variant, size }), classCustom, disabledClass)} {...linkProps}>
        {children}
        <span className="text-2xl font-medium">{text}</span>
      </Link>
    )
  }

  return (
    <button className={cn(btnVariants({ variant, size }), classCustom, disabledClass)} {...buttonProps}>
      {loading && <Loader2 className="w-5 h-5 animate-spin" />}
      <span className="text-2xl font-medium">{text}</span>
      {children}
    </button>
  )
}

export default Btn
