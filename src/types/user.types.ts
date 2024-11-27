export type Role = "admin" | "user" | "manager";
export type Permissions = "create" | "read" | "update" | "delete";
export type IsActive = true | false;
export type Theme = "dark" | "light" | "system";

export interface RoleAndPermissions {
  id?: string;
  name: Role;
  permissions: Permissions[];
  isActive?: IsActive;
}
export interface User {
  _id?: string;
  username: string;
  email: string;
  isActive: IsActive;
  role: RoleAndPermissions;
  createdAt?: string
}
