import { useState, useEffect } from "react";
import { PhoneOff, RotateCcw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import ReportSkeleton from "@/components/skeletons/ReportSkeleton";
import TablePagination from "@/components/TablePagination";
import { usePagination } from "@/hooks/usePagination";
import { useDebounce } from "@/hooks/useDebounce";
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

interface IPPhoneDisconnectData {
  id: string;
  createdOn: string;
  deviceIdentifier: string;
  callId: string;
  partyNumber: string;
  reson: string; // Note: typo from original API
}

const IPPhoneDisconnectReport = () => {
  const [allData, setAllData] = useState<IPPhoneDisconnectData[]>([]);
  const [filteredData, setFilteredData] = useState<IPPhoneDisconnectData[]>([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    deviceIdentifier: "",
    callId: "",
    reason: "",
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
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<IPPhoneDisconnectData[]>(ENDPOINTS.IP_PHONE_DISCONNECT);
      setAllData(data);
      setFilteredData(data);
    } catch (error) {
      console.error("Failed to fetch IP phone disconnect data:", error);
      toast.error("Failed to fetch IP phone disconnect data");
      setAllData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFilters = useDebounce(filters, 300);

  useEffect(() => {
    applyFilters();
  }, [debouncedFilters, allData]);

  const applyFilters = () => {
    let result = [...allData];
    const f = debouncedFilters;

    if (f.startDate) {
      result = result.filter((item) => {
        const itemDate = item.createdOn?.split(" ")[0];
        return itemDate >= f.startDate;
      });
    }

    if (f.endDate) {
      result = result.filter((item) => {
        const itemDate = item.createdOn?.split(" ")[0];
        return itemDate <= f.endDate;
      });
    }

    if (f.deviceIdentifier) {
      result = result.filter((item) =>
        item.deviceIdentifier?.toLowerCase().includes(f.deviceIdentifier.toLowerCase())
      );
    }

    if (f.callId) {
      result = result.filter((item) =>
        item.callId?.toLowerCase().includes(f.callId.toLowerCase())
      );
    }

    if (f.reason) {
      result = result.filter((item) =>
        item.reson?.toLowerCase().includes(f.reason.toLowerCase())
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
      reason: "",
    });
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getReasonVariant = (reason: string) => {
    if (!reason) return "bg-secondary/50 text-muted-foreground";

    switch (reason.toLowerCase()) {
      case "service not found":
        return "bg-destructive/20 text-destructive border-destructive/30";
      case "normal call clearing":
        return "bg-success/20 text-success border-success/30";
      case "user busy":
        return "bg-warning/20 text-warning border-warning/30";
      default:
        return "bg-secondary/50 text-muted-foreground";
    }
  };

  if (loading) {
    return <ReportSkeleton columns={5} filterCount={5} />;
  }

  return (
    <div className="h-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-destructive/10 border border-destructive/30">
          <PhoneOff className="h-6 w-6 text-destructive" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-wider text-foreground">
            IP Phone Disconnect Report
          </h1>
          <p className="text-sm text-muted-foreground">
            View and filter IP phone disconnect records
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
            <Label className="text-muted-foreground text-xs">Disconnect Reason</Label>
            <Input
              name="reason"
              placeholder="Filter reason"
              value={filters.reason}
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
              <TableHead className="font-display text-xs uppercase tracking-wider text-primary">Reason</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <TableRow key={item.id || index} className="border-border/30 hover:bg-secondary/30">
                  <TableCell className="text-sm text-muted-foreground">{formatDateTime(item.createdOn)}</TableCell>
                  <TableCell className="font-mono text-sm text-foreground">{item.deviceIdentifier || "N/A"}</TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">{item.callId || "N/A"}</TableCell>
                  <TableCell className="text-muted-foreground">{item.partyNumber || "N/A"}</TableCell>
                  <TableCell>
                    <Badge className={`${getReasonVariant(item.reson)} flex items-center gap-1 w-fit`}>
                      <AlertTriangle className="h-3 w-3" />
                      {item.reson || "UNKNOWN"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  {allData.length === 0 ? "No disconnect data available" : "No records match your filters"}
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

export default IPPhoneDisconnectReport;
