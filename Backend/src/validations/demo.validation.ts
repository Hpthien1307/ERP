import { z } from "zod"
import { role_type } from "@prisma/client"
import { FIELD_MESSAGE } from "../constant/systemMessage.js"

/**
 * ============================================================================
 * TỔNG HỢP CÁC PHƯƠNG THỨC & Ý NGHĨA TRONG ZOD VALIDATION
 * ============================================================================
 *
 * 1. KIỂU DỮ LIỆU CƠ BẢN (BASIC TYPES)
 * - z.object({ ... })      : Tạo một schema xác thực kiểu Object (đối tượng) chứa các thuộc tính bên trong.
 * - z.string({ message })  : Ràng buộc giá trị phải là kiểu chuỗi (String). Có thể tùy chỉnh thông báo lỗi.
 * - z.number({ message })  : Ràng buộc giá trị phải là kiểu số (Number).
 * - z.boolean()            : Ràng buộc giá trị phải là kiểu đúng/sai (Boolean: true/false).
 * - z.array(z.string())    : Ràng buộc dữ liệu phải là một mảng (Array) các phần tử (ví dụ: mảng chuỗi).
 * - z.enum(["A", "B"])     : Ràng buộc giá trị phải thuộc mảng các chuỗi cố định.
 * - z.union([A, B])        : Ràng buộc giá trị thỏa mãn ít nhất 1 trong các schema truyền vào (phép OR).
 *
 * 2. KIỂM TRA & BIẾN ĐỔI CHUỖI (STRING VALIDATION & TRANSFORMATION)
 * - .email("...")          : Kiểm tra chuỗi phải có định dạng Email hợp lệ (ví dụ: user@domain.com).
 * - .url("...")            : Kiểm tra chuỗi phải là định dạng URL hợp lệ (ví dụ: https://example.com).
 * - .uuid("...")           : Kiểm tra chuỗi phải tuân theo chuẩn định dạng UUID (v4).
 * - .min(n, "...")         : Độ dài tối thiểu của chuỗi phải từ n ký tự trở lên.
 * - .max(n, "...")         : Độ dài tối đa của chuỗi không được vượt quá n ký tự.
 * - .trim()                : Tự động cắt bỏ khoảng trắng thừa ở 2 đầu chuỗi.
 * - .toLowerCase()         : Tự động chuyển toàn bộ chuỗi sang chữ thường (thường dùng cho email).
 * - .toUpperCase()         : Tự động chuyển toàn bộ chuỗi sang chữ hoa.
 *
 * 3. KIỂM TRA SỐ (NUMBER VALIDATION)
 * - .int("...")            : Ràng buộc số phải là số nguyên (Integer, không chấp nhận số thập phân).
 * - .positive("...")       : Ràng buộc số phải lớn hơn 0 (> 0, số dương, thường dùng cho ID).
 * - .nonnegative("...")    : Ràng buộc số phải lớn hơn hoặc bằng 0 (>= 0, số không âm).
 * - .gt(n) / .gte(n)       : Lớn hơn n / Lớn hơn hoặc bằng n.
 * - .lt(n) / .lte(n)       : Nhỏ hơn n / Nhỏ hơn hoặc bằng n.
 *
 * 4. ÉP KIỂU DỮ LIỆU TỰ ĐỘNG (COERCION)
 * - z.coerce.number()      : Tự động ép kiểu đầu vào thành Số (chuỗi "123" -> số 123, thích hợp cho req.params/query).
 * - z.coerce.date()        : Tự động ép kiểu chuỗi ngày/ISO thành đối tượng Date trong JavaScript.
 * - z.coerce.boolean()     : Tự động ép kiểu đầu vào thành Boolean.
 *
 * 5. TÙY CHỌN & GIÁ TRỊ MẶC ĐỊNH (MODIFIERS)
 * - .optional()            : Cho phép trường này có thể bỏ qua (undefined) khi gửi request.
 * - .nullable()            : Cho phép trường này có thể mang giá trị null.
 * - .nullish()             : Cho phép giá trị là null hoặc undefined.
 * - .default(value)        : Đặt giá trị mặc định nếu client không truyền vào (hoặc truyền undefined).
 *
 * 6. ENUM & CUSTOM VALIDATION
 * - z.nativeEnum(Enum)     : Validate dữ liệu dựa trên Enum gốc của TypeScript / Prisma (ví dụ: role_type).
 * - .refine(fn, options)   : Tự định nghĩa logic xác thực tùy chỉnh (ví dụ: kiểm tra confirm_password === password).
 * - .superRefine(fn)       : Tự định nghĩa logic xác thực nâng cao, hỗ trợ addIssue linh hoạt.
 * - .transform(fn)         : Biến đổi dữ liệu sau khi xác thực thành dạng/kiểu mới.
 *
 * 7. TRÍCH XUẤT KIỂU TYPESCRIPT (TYPE INFERENCE)
 * - z.infer<typeof schema> : Rút trích (extract) kiểu dữ liệu TypeScript tự động từ Zod Schema.
 * ============================================================================
 */

// Ví dụ Schema minh họa thực tế dùng Zod
export const DemoValidation = {
  demoSchema: z
    .object({
      // Chuỗi & Kiểm tra định dạng
      email: z
        .string({ message: FIELD_MESSAGE.FIELD_NOT_EMPTY })
        .email("Email không đúng định dạng")
        .toLowerCase()
        .trim(),
      password: z
        .string({ message: FIELD_MESSAGE.FIELD_NOT_EMPTY })
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
      confirm_password: z
        .string({ message: FIELD_MESSAGE.FIELD_NOT_EMPTY }),
      full_name: z
        .string({ message: FIELD_MESSAGE.FIELD_NOT_EMPTY })
        .min(1, FIELD_MESSAGE.FIELD_REQUIRE)
        .trim(),
      avatar_url: z.string().url("URL hình ảnh không hợp lệ").nullable().optional(),
      user_id: z.string().uuid("ID người dùng phải là UUID hợp lệ"),

      // Số & Ràng buộc giá trị
      department_id: z.coerce
        .number({ message: FIELD_MESSAGE.FIELD_ID })
        .positive(FIELD_MESSAGE.FIED_ID_POSITIVE),
      leave_balance: z.number().int().nonnegative().default(12),

      // Ngày tháng & Enum từ Prisma
      due_date: z.coerce.date({ message: "Hạn hoàn thành không hợp lệ" }),
      role: z.nativeEnum(role_type).default(role_type.EMPLOYEE),

      // Mảng & Tùy chọn
      tags: z.array(z.string()).optional()
    })
    // Validation tùy chỉnh so sánh mảng/trường trong object
    .refine((data) => data.password === data.confirm_password, {
      message: "Mật khẩu xác nhận không khớp với mật khẩu",
      path: ["confirm_password"]
    })
}

// Extract Type tự động từ Schema để sử dụng trong Controller / Service
export type DemoInput = z.infer<typeof DemoValidation.demoSchema>
