import axios from "axios"

export const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
  timeout: 10000,
  withCredentials: true, // Tự động gửi cookie chứa accessToken / refreshToken
  headers: {
    "Content-Type": "application/json"
  }
})

// Cờ kiểm tra xem có đang trong quá trình refresh token hay không
let isRefreshing = false
// Hàng đợi lưu các request bị lỗi 401 để retry sau khi refresh token xong
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: unknown) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })
  failedQueue = []
}

// user đang thao thác mà access token hết hạn thì interceptors sẽ chặn lỗi 401 gửi về sever sau đó sẽ thực thi gọi api refresh-token ngầm
// nếu thành công thì retry lại request ban đầu nếu thất bại thì chuyển hướng về trang đăng nhập
axiosClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    // 1. Kiểm tra nếu Backend trả lỗi 401 và không phải là request gọi API refresh-token
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes("/auth/refresh-token")) {
      // Nếu đang có 1 request khác tiến hành refresh token, thêm request hiện tại vào hàng đợi
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => axiosClient(originalRequest))
          .catch(err => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // 2. Gọi API refresh-token ngầm
        await axiosClient.post("/auth/refresh-token")

        // 3. Cho phép các request trong hàng đợi chạy lại
        processQueue(null)

        // 4. Retry lại request ban đầu
        return axiosClient(originalRequest)
      } catch (refreshError) {
        // 5. Nếu refresh token thất bại (RefreshToken hết hạn hoàn toàn hoặc không hợp lệ)
        processQueue(refreshError)

        // Chuyển hướng người dùng về trang đăng nhập
        if (window.location.pathname !== "/login") {
          window.location.href = "/login"
        }
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)
