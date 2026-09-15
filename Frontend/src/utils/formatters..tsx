export const FormatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)
}

export const FormatDate = (date: string) => {
  return new Date(date).toLocaleDateString("vi-VN")
}

export const FormatDateTime = (date: string) => {
  return new Date(date).toLocaleString("vi-VN")
}
