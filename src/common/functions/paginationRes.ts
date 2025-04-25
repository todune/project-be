import { Model, FindAndCountOptions, ModelStatic } from 'sequelize'

interface PaginationOptions {
     page?: number
     limit?: number
}

interface PaginationResult<T> {
     totalItems: number
     totalPages: number
     currentPage: number
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
               totalItems: count,
               totalPages,
               currentPage: page,
               items: rows as T[],
          }
     }
}

export default PaginationRes
