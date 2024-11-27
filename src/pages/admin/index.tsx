import AdminStats from "@/components/admin/adminStats";
import DownloadStats from "@/components/admin/DownloadStats";
import React from "react";

interface AdminProps {}

const AdminDashBoard: React.FC<AdminProps> = (props) => {
  return (
    <>
      <AdminStats />
      <DownloadStats />
    </>
  );
};

export default AdminDashBoard;
