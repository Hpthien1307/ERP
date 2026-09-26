export const FormatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)
}

export const FormatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString("vi-VN")
}

export const FormatDateTime = (date: string | Date) => {
  return new Date(date).toLocaleTimeString("vi-VN")
}
export const formatSliceId = ({ id, length }: { id: string | number; length?: number }) => {
  if (typeof id === "number") {
    id = id.toString()
  }
  return id.slice(-(length ? length : 6)).toUpperCase()
}

export const getTodayDateString = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const day = String(today.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}
