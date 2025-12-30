import { useState, useEffect } from "react";
import { Phone, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import ReportSkeleton from "@/components/skeletons/ReportSkeleton";
import TablePagination from "@/components/TablePagination";
import { usePagination } from "@/hooks/usePagination";
import { apiFetch, ENDPOINTS } from "@/lib/api";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface IPPhoneAuditData {
  id: string;
  callDisconnectDateTime: string;
  deviceIdentifier: string;
  callId: string;
  partyNumber: string;
  state: string;
  createdOn: string;
}

const IPPhoneAuditReport = () => {
  const [allData, setAllData] = useState<IPPhoneAuditData[]>([]);
  const [filteredData, setFilteredData] = useState<IPPhoneAuditData[]>([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    deviceIdentifier: "",
    callId: "",
    state: "",
  });
  const [loading, setLoading] = useState(false);

  const {
    paginatedData,
    currentPage,
    pageSize,
    totalItems,
    handlePageChange,
    handlePageSizeChange,
  } = usePagination({ data: filteredData });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<IPPhoneAuditData[]>(ENDPOINTS.IP_PHONE_AUDIT);
      setAllData(data);
      setFilteredData(data);
    } catch (error) {
      console.error("Failed to fetch IP phone audit data:", error);
      toast.error("Failed to fetch IP phone audit data");
      setAllData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [filters, allData]);

  const applyFilters = () => {
    let result = [...allData];

    if (filters.startDate) {
      result = result.filter((item) => {
        const itemDate = new Date(item.callDisconnectDateTime).toISOString().split("T")[0];
        return itemDate >= filters.startDate;
      });
    }

    if (filters.endDate) {
      result = result.filter((item) => {
        const itemDate = new Date(item.callDisconnectDateTime).toISOString().split("T")[0];
        return itemDate <= filters.endDate;
      });
    }

    if (filters.deviceIdentifier) {
      result = result.filter((item) =>
        item.deviceIdentifier?.toLowerCase().includes(filters.deviceIdentifier.toLowerCase())
      );
    }

    if (filters.callId) {
      result = result.filter((item) =>
        item.callId?.toLowerCase().includes(filters.callId.toLowerCase())
      );
    }

    if (filters.state) {
      result = result.filter((item) =>
        item.state?.toLowerCase().includes(filters.state.toLowerCase())
      );
    }

    setFilteredData(result);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      deviceIdentifier: "",
      callId: "",
      state: "",
    });
  };

  const formatDateTime = (timestamp: string) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getStateVariant = (state: string) => {
    if (!state) return "bg-secondary/50 text-muted-foreground";

    switch (state.toLowerCase()) {
      case "connectioncleared":
        return "bg-destructive/20 text-destructive border-destructive/30";
      case "connected":
        return "bg-success/20 text-success border-success/30";
      case "disconnected":
        return "bg-warning/20 text-warning border-warning/30";
      default:
        return "bg-secondary/50 text-muted-foreground";
    }
  };

  if (loading) {
    return <ReportSkeleton columns={6} filterCount={5} />;
  }

  return (
    <div className="h-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
          <Phone className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-wider text-foreground">
            IP Phone Audit Report
          </h1>
          <p className="text-sm text-muted-foreground">
            View and filter IP phone audit records
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 rounded-lg bg-card border border-border/30 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs">From Date</Label>
            <Input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="bg-secondary/50 border-border/50 focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs">To Date</Label>
            <Input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="bg-secondary/50 border-border/50 focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs">Device ID</Label>
            <Input
              name="deviceIdentifier"
              placeholder="Filter device"
              value={filters.deviceIdentifier}
              onChange={handleFilterChange}
              className="bg-secondary/50 border-border/50 focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs">Call ID</Label>
            <Input
              name="callId"
              placeholder="Filter call ID"
              value={filters.callId}
              onChange={handleFilterChange}
              className="bg-secondary/50 border-border/50 focus:border-primary"
            />
          </div>
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={resetFilters}
              className="w-full border-border/50 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border border-border/30 rounded-lg overflow-hidden bg-card/50">
        <Table>
          <TableHeader>
            <TableRow className="border-border/30 hover:bg-transparent">
              <TableHead className="font-display text-xs uppercase tracking-wider text-primary">Disconnect Time</TableHead>
              <TableHead className="font-display text-xs uppercase tracking-wider text-primary">Device ID</TableHead>
              <TableHead className="font-display text-xs uppercase tracking-wider text-primary">Call ID</TableHead>
              <TableHead className="font-display text-xs uppercase tracking-wider text-primary">Party Number</TableHead>
              <TableHead className="font-display text-xs uppercase tracking-wider text-primary">State</TableHead>
              <TableHead className="font-display text-xs uppercase tracking-wider text-primary">Created On</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <TableRow key={item.id || index} className="border-border/30 hover:bg-secondary/30">
                  <TableCell className="text-sm text-muted-foreground">{formatDateTime(item.callDisconnectDateTime)}</TableCell>
                  <TableCell className="font-mono text-sm text-foreground">{item.deviceIdentifier || "N/A"}</TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">{item.callId || "N/A"}</TableCell>
                  <TableCell className="text-muted-foreground">{item.partyNumber || "N/A"}</TableCell>
                  <TableCell>
                    <Badge className={getStateVariant(item.state)}>{item.state || "UNKNOWN"}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.createdOn ? new Date(item.createdOn).toLocaleString() : "N/A"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {allData.length === 0 ? "No audit data available" : "No records match your filters"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          currentPage={currentPage}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
};

export default IPPhoneAuditReport;
