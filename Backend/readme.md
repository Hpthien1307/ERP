## Quy trình khởi tạo dự án ExpressJS + TypeScript + PostgreSQL (Prisma ORM)

### BƯỚC 1: Khởi tạo thư mục và Node.js project

```bash
npm init -y
```

### BƯỚC 2: Cài đặt các thư viện cần thiết

Các thư viện đã được cài đặt và cấu hình trong `package.json`:

#### 1. Thư viện chạy thực tế (Dependencies)

Cài đặt bằng lệnh:

```bash
npm install express @prisma/client jsonwebtoken http-status-codes dotenv cors helmet morgan cookie-parser
```

- Chi tiết các gói:
  - `express`: Framework Node.js chính để xây dựng API.
  - `@prisma/client`: Client của Prisma ORM để giao tiếp & truy vấn database PostgreSQL.
  - `jsonwebtoken`: Quản lý Authentication sử dụng JWT (tạo, mã hoá và kiểm tra token).
  - `http-status-codes`: Cung cấp danh sách các mã lỗi HTTP chuẩn (StatusCodes.OK, StatusCodes.BAD_REQUEST, v.v.), giúp code tường minh hơn.
  - `dotenv`: Đọc biến môi trường từ file `.env` vào `process.env`.
  - `cors`: Cấu hình chia sẻ tài nguyên nguồn gốc chéo (Cross-Origin Resource Sharing).
  - `helmet`: Bảo mật ứng dụng Express bằng cách thiết lập các HTTP headers khác nhau.
  - `morgan`: Middleware ghi log ghi lại thông tin các HTTP requests đến server.
  - `cookie-parser`: Phân tích cú pháp cookies được gửi kèm trong HTTP request.

#### 2. Thư viện phát triển (DevDependencies)

Cài đặt bằng lệnh:

```bash
npm install -D typescript @types/node @types/express @types/jsonwebtoken @types/cors @types/morgan @types/cookie-parser prisma nodemon ts-node ts-node-dev tsx
```

- Chi tiết các gói:
  - `typescript`: Trình biên dịch TypeScript.
  - `@types/*`: Định nghĩa kiểu dữ liệu (Types) tương ứng cho các thư viện JS phục vụ TypeScript Intellisense.
  - `prisma`: CLI của Prisma ORM để quản lý migrations và schemas.
  - `nodemon`: Tự động khởi động lại server khi phát hiện thay đổi trong mã nguồn.
  - `ts-node`: Cho phép thực thi file TypeScript trực tiếp không cần compile thủ công sang JS.
  - `ts-node-dev`: Giải pháp thay thế chạy dev server nhanh chóng.
  - `tsx`: Trình chạy TypeScript cực nhanh (dựa trên esbuild), hỗ trợ hoàn hảo ES Modules.

---

### BƯỚC 3: Khởi tạo cấu hình TypeScript

```bash
npx tsc --init
```

_(Đã cấu hình trong file `tsconfig.json`)_

---

### BƯỚC 4: Khởi tạo môi trường Prisma ORM (Database PostgreSQL)

```bash
npx prisma init
```

_(File cấu hình database nằm ở `prisma/schema.prisma` và file `.env`)_

---

### BƯỚC 5: Đồng bộ Database (Chạy sau khi thiết kế xong schema.prisma)

```bash
npx prisma migrate dev --name init_database
```

---

### BƯỚC 6: Lệnh chạy ứng dụng (Mục "scripts" trong package.json)

Trong dự án đã cấu hình các lệnh chạy chính:

- **Chạy môi trường Develop (Nodemon tự động tải lại code):**

  ```bash
  npm run dev
  ```

  _(Sử dụng cấu hình watch của file `nodemon.json`)_

- **Biên dịch code TypeScript sang JavaScript thuần:**

  ```bash
  npm run build
  ```

- **Chạy server build (Production):**
  ```bash
  npm run start
  ```
