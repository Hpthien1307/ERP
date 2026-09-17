import { useEffect, useState, memo } from "react"
import { FormatDate, FormatDateTime } from "@/utils/formatters"

const ClockDisplay = () => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  console.log("render 2")

  return (
    <div className="flex flex-col gap-y-4">
      <span className="text-blue-100 text-md font-medium">{FormatDate(currentTime)}</span>
      <span className="text-white text-xg sm:text-7xl font-bold tracking-tight tabular-nums">{FormatDateTime(currentTime)}</span>
    </div>
  )
}

export default memo(ClockDisplay)
