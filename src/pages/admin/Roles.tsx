"use client";

import { useState, useEffect } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Client } from "@/api/axios"; // Assuming you have an API client set up

interface Role {
  _id: string;
  name: string;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const defaultPermissions = ["read", "create", "update", "delete"];

export default function Roles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const response = await Client.get("/admin/role");
      setRoles(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch roles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setIsAddingRole(false);
  };

  const handleAddRole = () => {
    setEditingRole(null);
    setIsAddingRole(true);
  };

  const handleDelete = async (roleId: string) => {
    try {
      await Client.delete(`/admin/role/${roleId}`);
      toast({
        title: "Success",
        description: "Role deleted successfully",
      });
      fetchRoles();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete role. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveRole = async (roleData: Partial<Role>) => {
    try {
      if (isAddingRole) {
        await Client.post("/admin/role", roleData);
        toast({
          title: "Success",
          description: "New role created successfully",
        });
      } else {
        console.log(roleData);
        const res = await Client.put(`/admin/role/${roleData._id}`, {
          name: roleData.name,
          permissions: roleData.permissions,
          isActive: roleData.isActive,
        });
        console.log(res.data);
        toast({
          title: "Success",
          description: "Role updated successfully",
        });
      }
      setEditingRole(null);
      setIsAddingRole(false);
      fetchRoles();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${
          isAddingRole ? "create" : "update"
        } role. Please try again.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Roles and Permissions</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={handleAddRole}>
              <Plus className="mr-2 h-4 w-4" /> Add Role
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {isAddingRole ? "Add New Role" : "Edit Role"}
              </DialogTitle>
              <DialogDescription>
                {isAddingRole
                  ? "Create a new role and set its permissions."
                  : "Edit role details and permissions."}
              </DialogDescription>
            </DialogHeader>
            <RoleForm
              role={editingRole}
              isNewRole={isAddingRole}
              onSave={handleSaveRole}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  <div className="flex justify-center items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                    <span>Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : roles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No roles found
                </TableCell>
              </TableRow>
            ) : (
              roles.map((role) => (
                <TableRow key={role._id}>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>{role.permissions.join(", ")}</TableCell>
                  <TableCell>{role.isActive ? "Active" : "Inactive"}</TableCell>
                  <TableCell>
                    {new Date(role.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(role)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Edit Role</DialogTitle>
                            <DialogDescription>
                              Make changes to the role here. Click save when
                              you're done.
                            </DialogDescription>
                          </DialogHeader>
                          <RoleForm role={role} onSave={handleSaveRole} />
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(role._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

interface RoleFormProps {
  role?: Role | null;
  isNewRole?: boolean;
  onSave: (role: Partial<Role>) => void;
}

function RoleForm({ role, isNewRole = false, onSave }: RoleFormProps) {
  const [formData, setFormData] = useState({
    name: role?.name || "",
    permissions: role?.permissions || [],
    isActive: role?.isActive ?? true,
  });
  const [customPermission, setCustomPermission] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (permission: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const handleAddCustomPermission = () => {
    if (customPermission && !formData.permissions.includes(customPermission)) {
      setFormData((prev) => ({
        ...prev,
        permissions: [...prev.permissions, customPermission],
      }));
      setCustomPermission("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, _id: role?._id });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-start gap-4">
          <Label className="text-right">Permissions</Label>
          <div className="col-span-3 space-y-2">
            {defaultPermissions.map((permission) => (
              <div key={permission} className="flex items-center space-x-2">
                <Checkbox
                  id={permission}
                  checked={formData.permissions.includes(permission)}
                  onCheckedChange={() => handlePermissionChange(permission)}
                />
                <Label htmlFor={permission}>{permission}</Label>
              </div>
            ))}
            {formData.permissions
              .filter((p) => !defaultPermissions.includes(p))
              .map((permission) => (
                <div key={permission} className="flex items-center space-x-2">
                  <Checkbox
                    id={permission}
                    checked={true}
                    onCheckedChange={() => handlePermissionChange(permission)}
                  />
                  <Label htmlFor={permission}>{permission}</Label>
                </div>
              ))}
            <div className="flex items-center space-x-2 mt-2">
              <Input
                placeholder="Add custom permission"
                value={customPermission}
                onChange={(e) => setCustomPermission(e.target.value)}
              />
              <Button type="button" onClick={handleAddCustomPermission}>
                Add
              </Button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="status" className="text-right">
            Status
          </Label>
          <div className="flex items-center space-x-2 col-span-3">
            <Checkbox
              id="status"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  isActive: checked as boolean,
                }))
              }
            />
            <Label htmlFor="status">
              {formData.isActive ? "Active" : "Inactive"}
            </Label>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">Save changes</Button>
      </DialogFooter>
    </form>
  );
}
