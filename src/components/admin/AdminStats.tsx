
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Client } from "@/api/axios";

interface StatsData {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  roleUserCounts: { _id: string; count: number }[];
  totalRoles: number;
  activeRoles: number;
}

export default function AdminStats() {
  const [statsData, setStatsData] = useState<StatsData | null>(null);

  const fetchStatistics = async () => {
    try {
      const response = await Client.get<StatsData>("/admin/stats");
      setStatsData(response.data);
    } catch (error) {
      console.error("Failed to fetch statistics", error);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  const userStatsData = statsData
    ? [
        {
          category: "Users",
          Total: statsData.totalUsers,
          Active: statsData.activeUsers,
          Inactive: statsData.inactiveUsers,
        },
        {
          category: "Roles",
          Total: statsData.totalRoles,
          Active: statsData.activeRoles,
          Inactive: statsData.totalRoles - statsData.activeRoles,
        },
      ]
    : [];

  return (
    <Card className="w-full max-w-fit border-0 shadow-none">
      <CardContent className="flex flex-col md:flex-row justify-center items-start gap-8">
        <div className="w-full md:w-1/2">
          <CardTitle className="text-xl font-space-mono mb-4">
            User and Role Statistics
          </CardTitle>
          <ChartContainer
            config={{
              Total: {
                label: "Total",
                color: "hsl(var(--chart-1))",
              },
              Active: {
                label: "Active",
                color: "hsl(var(--chart-2))",
              },
              Inactive: {
                label: "Inactive",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={userStatsData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="Total" fill="var(--color-Total)" />
                <Bar dataKey="Active" fill="var(--color-Active)" />
                <Bar dataKey="Inactive" fill="var(--color-Inactive)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <div className="w-full md:w-1/2">
          <CardTitle className="font-space-mono text-xl mb-4">
            Role Distribution
          </CardTitle>
          <ChartContainer
            config={{
              count: {
                label: "Count",
                color: "hsl(var(--chart-4))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={statsData?.roleUserCounts || []}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="_id" type="category" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}

