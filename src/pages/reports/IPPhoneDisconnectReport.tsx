import { useState, useEffect } from "react";
import { PhoneOff, RotateCcw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import ReportSkeleton from "@/components/skeletons/ReportSkeleton";
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

// Mock data
const mockData: IPPhoneDisconnectData[] = [
  {
    id: "1",
    createdOn: "2025-01-15 10:30:00",
    deviceIdentifier: "DEVICE-001",
    callId: "CALL-001",
    partyNumber: "+1234567890",
    reson: "Normal call clearing",
  },
  {
    id: "2",
    createdOn: "2025-01-15 11:45:00",
    deviceIdentifier: "DEVICE-002",
    callId: "CALL-002",
    partyNumber: "+0987654321",
    reson: "Service not found",
  },
  {
    id: "3",
    createdOn: "2025-01-15 14:20:00",
    deviceIdentifier: "DEVICE-003",
    callId: "CALL-003",
    partyNumber: "+1122334455",
    reson: "User busy",
  },
];

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

    if (filters.reason) {
      result = result.filter((item) =>
        item.reson?.toLowerCase().includes(filters.reason.toLowerCase())
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
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <TableRow key={item.id} className="border-border/30 hover:bg-secondary/30">
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
      </div>
    </div>
  );
};

export default IPPhoneDisconnectReport;
