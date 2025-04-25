export enum OrderStatus {
     DOING = 'Đang giao hàng',
     DONE = 'Đã giao hàng',
     REFUND = 'Đã hoàn trả',
     CANCEL = 'Đã hủy',
}

export enum DeviceStatusType {
     NORMAL = 'Bình thường',
     REPAIRING = 'Đang sửa chữa',
     BROKEN = 'Hư hỏng',
}

export enum OrderStatusType {
     NEW = 'Mới',
     PENDING = 'Chờ duyệt',
     APPROVED = 'Đã duyệt',
     RECEIVED = 'Đã nhận',
     PENDING_CHECK = 'Chờ kiểm tra',
     CHECKED = 'Đã kiểm tra',
     REFUNDED = 'Đã hoàn trả',
}

export interface MulterRequest extends Request {
     files: {
          deviceImage?: Express.Multer.File[]
          detailImage?: Express.Multer.File[]
     }
}

export interface UploadedFile {
     filename: string
     originalname: string
}

export interface FileData {
     key: string
     type: string
     value: string
     name: string
     linkDb?: string
}

export interface DataFolderNode {
     id?: string
     name: string
     qrCode?: string
     linkQr?: string
     linkFile?: string
     children?: DataFolderNode[]
     code?: string
     type?: string
     isCat?: boolean
     identify: string
     has?: boolean
     info?: DataMobilize
     notEdit?: boolean
}

export interface PermissionInterface {
     name: string
     identify: string
     has: number
}

export interface DataPermission {
     [category: string]: DataFolderNode[]
}

export interface ListMsg {
     row: number
     message: string
}

export interface DataRow {
     [key: string]: any
}

export interface DataMobilize {
     divisionMobilize?: string
     addressMobilize?: string
     intendTime?: string
     realTime?: string
     status?: string
     totalTime?: string
     note?: string
}
