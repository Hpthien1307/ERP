import { cn } from "cn"
import { LoaderCircle } from "lucide-react"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return <LoaderCircle data-slot="spinner" role="status" aria-label="Loading" className={cn("size-4 text-blue-600 animate-spin", className)} {...props} />
}

export { Spinner }
