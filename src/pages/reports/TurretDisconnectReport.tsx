import { useState, useEffect } from "react";
import { Radio, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ReportSkeleton from "@/components/skeletons/ReportSkeleton";
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

// Mock data
const mockData: TurretDisconnectData[] = [
  {
    callId: "CALL-001",
    createdOn: "2025-01-15 10:30:00",
    turretName: "Turret Alpha",
    lineNo: "Line 1",
    partyNumber: "+1234567890",
  },
  {
    callId: "CALL-002",
    createdOn: "2025-01-15 11:45:00",
    turretName: "Turret Bravo",
    lineNo: "Line 2",
    partyNumber: "+0987654321",
  },
  {
    callId: "CALL-003",
    createdOn: "2025-01-15 14:20:00",
    turretName: "Turret Alpha",
    lineNo: "Line 3",
    partyNumber: "+1122334455",
  },
];

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setAllData(mockData);
      setFilteredData(mockData);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, allData]);

  const applyFilters = () => {
    let result = [...allData];

    if (filters.startDate) {
      result = result.filter((item) => {
        const itemDate = item.createdOn.split(" ")[0];
        return itemDate >= filters.startDate;
      });
    }

    if (filters.endDate) {
      result = result.filter((item) => {
        const itemDate = item.createdOn.split(" ")[0];
        return itemDate <= filters.endDate;
      });
    }

    if (filters.turretName) {
      result = result.filter((item) =>
        item.turretName.toLowerCase().includes(filters.turretName.toLowerCase())
      );
    }

    if (filters.lineNo) {
      result = result.filter((item) =>
        item.lineNo.toLowerCase().includes(filters.lineNo.toLowerCase())
      );
    }

    if (filters.partyNumber) {
      result = result.filter((item) =>
        item.partyNumber.toLowerCase().includes(filters.partyNumber.toLowerCase())
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
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
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
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <TableRow key={item.callId} className="border-border/30 hover:bg-secondary/30">
                  <TableCell className="text-sm text-muted-foreground">{formatDate(item.createdOn)}</TableCell>
                  <TableCell className="font-semibold text-foreground">{item.turretName}</TableCell>
                  <TableCell className="text-muted-foreground">{item.lineNo}</TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">{item.partyNumber}</TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">{item.callId}</TableCell>
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
      </div>
    </div>
  );
};

export default TurretDisconnectReport;
