import { Model, ModelStatic } from 'sequelize'

interface PaginationOptions {
     page?: number
     limit?: number
}

interface PaginationResult<T> {
     totalRecords: number
     totalPages: number
     currentPage: number
     size: number
     items: T[]
}

class PaginationRes<T> {
     private model: ModelStatic<Model<{}, {}>>
     private options: T
     private paginationOptions: PaginationOptions

     constructor(
          model: ModelStatic<Model<{}, {}>>,
          options: T,
          paginationOptions: PaginationOptions
     ) {
          this.model = model
          this.options = options
          this.paginationOptions = paginationOptions
     }

     async paginate(): Promise<PaginationResult<T>> {
          const { page = 1, limit = 10 } = this.paginationOptions
          const offset = (page - 1) * limit

          const { count, rows } = await this.model.findAndCountAll({
               ...this.options,
               limit,
               offset,
          })

          const totalPages = Math.ceil(count / limit)

          return {
               totalRecords: count || 0,
               totalPages: totalPages || 0,
               currentPage: page || 1,
               size: limit,
               items: (rows as T[]) || [],
          }
     }
}

export default PaginationRes
