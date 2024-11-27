import React from "react";
import { Button } from "../ui/button";
import { Client } from "@/api/axios";

interface DownlaodStatsProps {}

const DownloadStats: React.FC<DownlaodStatsProps> = (props) => {
  const handleExportCsv = async () => {
    try {
      const response = await Client.get("/admin/getusercsv", {
        responseType: "blob",
      });

      // Create and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "users.csv");
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed", error);
      // Handle error
    }
  };
  const handleExportExcel = async () => {
    try {
      const response = await Client.get("/admin/getuserexcel", {
        responseType: "blob",
      });

      // Create and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "users.xlsx");
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed", error);
      // Handle error
    }
  };
  return (
    <>
      <div className="w-full p-4">
        <Button className="mx-4" onClick={handleExportCsv}>Download CSV</Button>
        <Button onClick={handleExportExcel}>Download Excel</Button>
      </div>
    </>
  );
};

export default DownloadStats;
