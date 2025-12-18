import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { Loading03Icon } from "@hugeicons/core-free-icons"

function Spinner({ className }: { className?: string }) {
  return (
    <HugeiconsIcon icon={Loading03Icon} size={16} className={cn("animate-spin", className)} />
  )
}

export { Spinner }
