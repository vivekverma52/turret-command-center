import { useState, useEffect } from "react";
import { FileAudio, RotateCcw } from "lucide-react";
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

interface AuditData {
  callId: string;
  createdOn: string;
  turretName: string;
  lineName: string;
  partyNumber: string;
  state: string;
  isFileAvailable: string;
}

const AuditReport = () => {
  const [allData, setAllData] = useState<AuditData[]>([]);
  const [filteredData, setFilteredData] = useState<AuditData[]>([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    turretName: "",
    lineName: "",
    partyNumber: "",
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
      const data = await apiFetch<AuditData[]>(ENDPOINTS.CALL_AUDIT);
      setAllData(data);
      setFilteredData(data);
    } catch (error) {
      console.error("Failed to fetch audit data:", error);
      toast.error("Failed to fetch audit data");
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

    if (f.turretName) {
      result = result.filter((item) =>
        item.turretName?.toLowerCase().includes(f.turretName.toLowerCase())
      );
    }

    if (f.lineName) {
      result = result.filter((item) =>
        item.lineName?.toLowerCase().includes(f.lineName.toLowerCase())
      );
    }

    if (f.partyNumber) {
      result = result.filter((item) =>
        item.partyNumber?.toLowerCase().includes(f.partyNumber.toLowerCase())
      );
    }

    if (f.state) {
      result = result.filter((item) =>
        item.state?.toLowerCase().includes(f.state.toLowerCase())
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
      turretName: "",
      lineName: "",
      partyNumber: "",
      state: "",
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getStateVariant = (state: string) => {
    switch (state) {
      case "Conversation":
        return "bg-success/20 text-success border-success/30";
      case "Connected":
        return "bg-primary/20 text-primary border-primary/30";
      case "Disconnected":
        return "bg-destructive/20 text-destructive border-destructive/30";
      default:
        return "bg-secondary/50 text-muted-foreground";
    }
  };

  if (loading) {
    return <ReportSkeleton columns={7} filterCount={6} />;
  }

  return (
    <div className="h-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
          <FileAudio className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-wider text-foreground">
            Call Audit Report
          </h1>
          <p className="text-sm text-muted-foreground">
            View and filter call audit records
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 rounded-lg bg-card border border-border/30 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
            <Label className="text-muted-foreground text-xs">Turret</Label>
            <Input
              name="turretName"
              placeholder="All turrets"
              value={filters.turretName}
              onChange={handleFilterChange}
              className="bg-secondary/50 border-border/50 focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs">Line</Label>
            <Input
              name="lineName"
              placeholder="All lines"
              value={filters.lineName}
              onChange={handleFilterChange}
              className="bg-secondary/50 border-border/50 focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs">Party Number</Label>
            <Input
              name="partyNumber"
              placeholder="All numbers"
              value={filters.partyNumber}
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
              <TableHead className="font-display text-xs uppercase tracking-wider text-primary">Timestamp</TableHead>
              <TableHead className="font-display text-xs uppercase tracking-wider text-primary">Turret</TableHead>
              <TableHead className="font-display text-xs uppercase tracking-wider text-primary">Line</TableHead>
              <TableHead className="font-display text-xs uppercase tracking-wider text-primary">Party Number</TableHead>
              <TableHead className="font-display text-xs uppercase tracking-wider text-primary">State</TableHead>
              <TableHead className="font-display text-xs uppercase tracking-wider text-primary">Recording</TableHead>
              <TableHead className="font-display text-xs uppercase tracking-wider text-primary">Call ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <TableRow key={item.callId || index} className="border-border/30 hover:bg-secondary/30">
                  <TableCell className="text-sm text-muted-foreground">{formatDate(item.createdOn)}</TableCell>
                  <TableCell className="font-semibold text-foreground">{item.turretName || "N/A"}</TableCell>
                  <TableCell className="text-muted-foreground">{item.lineName || "N/A"}</TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">{item.partyNumber || "N/A"}</TableCell>
                  <TableCell>
                    <Badge className={getStateVariant(item.state)}>{item.state || "Unknown"}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        item.isFileAvailable === "true"
                          ? "bg-success/20 text-success border-success/30"
                          : "bg-destructive/20 text-destructive border-destructive/30"
                      }
                    >
                      {item.isFileAvailable === "true" ? "Available" : "Not Available"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">{item.callId || "N/A"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
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

export default AuditReport;
