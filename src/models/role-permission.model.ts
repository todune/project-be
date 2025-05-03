import db from '@configs/db.config'
import { DataTypes, Model } from 'sequelize'
import Role from './role.model'
import Permission from './permission.model'

export interface RolePermissionInstance extends Model {
     role_id: number
     permission_id: number
}

const RolePermission = db.define<RolePermissionInstance>(
     'RolePermission',
     {
          role_id: {
               type: DataTypes.INTEGER,
               allowNull: false,
          },
          permission_id: {
               type: DataTypes.INTEGER,
               allowNull: false,
          },
     },
     {
          timestamps: false,
     }
)

Role.belongsToMany(Permission, {
     as: 'rolePermissionsData',
     through: RolePermission,
     foreignKey: 'role_id',
})
Permission.belongsToMany(Role, {
     as: 'permissionRolesData',
     through: RolePermission,
     foreignKey: 'permission_id',
})

export default RolePermission
