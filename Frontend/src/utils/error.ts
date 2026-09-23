export const getErrorMessage = (error: any) => {
  if (!error) return ""

  // Kiểm tra nếu là lỗi từ Axios
  const status = error.response?.status

  switch (status) {
    case 404:
      return "Không tìm thấy dữ liệu yêu cầu"
    case 403:
      return "Bạn không có quyền truy cập vào danh sách này."
    case 401:
      return "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
    case 500:
      return "Hệ thống đang gặp sự cố. Vui lòng thử lại sau ít phút."
    default:
      return error.message || "Đã có lỗi xảy ra. Vui lòng thử lại!"
  }
}
