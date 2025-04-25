class MessageError {
     static errorExist(arg0: string) {
         throw new Error('Method not implemented.')
     }
     static SOMETHING_WENT_WRONG = 'Có lỗi xảy ra. Vui lòng thử lại.'
     static PERMISSION_DENIED = 'Bạn không có quyền.'
     static SESSION_EXPIRED =
          'Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại'
     static INCORRECT_AUTH = 'Tên đăng nhập hoặc mật khẩu không chính xác'
     static CONFLICT_PASS_NEW = 'Mật khẩu mới phải khác mật khẩu hiện tại'
     static CONFLICT_PASS_OLD = 'Mật khẩu hiện tại không chính xác'
     static ERROR_UPLOAD_FILE = 'Tải file thất bại'
     static MISSING_INPUT = 'Vui lòng điền đầy đủ thông tin'
     static INVALID_INPUT = 'Dữ liệu không hợp lệ'
     static NOT_ACTIVE_ACCOUNT = 'Tài khoản đã bị vô hiệu hóa'
     static VERIFY_OK = 'Xác minh thành công'
     static VERIFY_FAIL = 'Xác minh thất bại'
     

     success(value: string) {
          return `${value} thành công.`
     }

     successMessageAdd(value: string) {
          return `Thêm ${value} thành công.`
     }

     successMessageUpdate(value: string) {
          return `Cập nhật ${value} thành công.`
     }

     successMessageDelete(value: string) {
          return `Xóa ${value} thành công.`
     }

     successMessageCancel(value: string) {
          return `Hủy ${value} thành công.`
     }

     successMessageRestore(value: string) {
          return `Khôi phục ${value} thành công.`
     }

     errorRequired(value: string) {
          return `${value} không được để trống.`
     }

     errorExist(value: string) {
          return `${value} đã tồn tại.`
     }

     errorNotExist(value: string) {
          return `${value} không tồn tại.`
     }
}

export default MessageError
