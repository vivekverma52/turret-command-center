import { useState, useEffect } from "react";
import { Radio, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface TurretDisconnectData {
  callId: string;
  createdOn: string;
  turretName: string;
  lineNo: string;
  partyNumber: string;
}

const TurretDisconnectReport = () => {
  const [allData, setAllData] = useState<TurretDisconnectData[]>([]);
  const [filteredData, setFilteredData] = useState<TurretDisconnectData[]>([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    turretName: "",
    lineNo: "",
    partyNumber: "",
  });
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

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
      const data = await apiFetch<TurretDisconnectData[]>(ENDPOINTS.TURRET_DISCONNECT);
      setAllData(data);
      setFilteredData(data);
    } catch (error) {
      console.error("Failed to fetch turret disconnect data:", error);
      toast.error("Failed to fetch turret disconnect data");
      setAllData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
      setInitialLoad(false);
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

    if (f.lineNo) {
      result = result.filter((item) =>
        item.lineNo?.toLowerCase().includes(f.lineNo.toLowerCase())
      );
    }

    if (f.partyNumber) {
      result = result.filter((item) =>
        item.partyNumber?.toLowerCase().includes(f.partyNumber.toLowerCase())
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
      lineNo: "",
      partyNumber: "",
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (initialLoad && loading) {
    return <ReportSkeleton columns={5} filterCount={5} />;
  }

  return (
    <div className="h-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-warning/10 border border-warning/30">
          <Radio className="h-6 w-6 text-warning" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-wider text-foreground">
            Turret Disconnect Report
          </h1>
          <p className="text-sm text-muted-foreground">
            View and filter turret disconnect records
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
            <Label className="text-muted-foreground text-xs">Line No</Label>
            <Input
              name="lineNo"
              placeholder="All lines"
              value={filters.lineNo}
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
              <TableHead className="font-display text-xs uppercase tracking-wider text-primary">Call ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <TableRow key={item.callId || index} className="border-border/30 hover:bg-secondary/30">
                  <TableCell className="text-sm text-muted-foreground">{formatDate(item.createdOn)}</TableCell>
                  <TableCell className="font-semibold text-foreground">{item.turretName || "N/A"}</TableCell>
                  <TableCell className="text-muted-foreground">{item.lineNo || "N/A"}</TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">{item.partyNumber || "N/A"}</TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">{item.callId || "N/A"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  {allData.length === 0 ? "No data available" : "No records match your filters"}
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

export default TurretDisconnectReport;
