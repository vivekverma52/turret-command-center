import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { type Turret } from "@/hooks/useTurrets";
import TablePagination from "@/components/TablePagination";
import { usePagination } from "@/hooks/usePagination";

interface TurretTableProps {
  turrets: Turret[];
  loading?: boolean;
  onEdit: (turret: Turret) => void;
  onDelete: (id: string) => void;
}

const TurretTable = ({ turrets, loading, onEdit, onDelete }: TurretTableProps) => {
  const {
    paginatedData,
    currentPage,
    pageSize,
    totalItems,
    handlePageChange,
    handlePageSizeChange,
  } = usePagination({ data: turrets });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-muted-foreground text-sm">Loading turrets...</span>
        </div>
      </div>
    );
  }

  if (turrets.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 border border-border/30 rounded-lg bg-card/50">
        <span className="text-muted-foreground">No turrets found. Create one to get started.</span>
      </div>
    );
  }

  return (
    <div className="border border-border/30 rounded-lg overflow-hidden bg-card/50">
      <Table>
        <TableHeader>
          <TableRow className="border-border/30 hover:bg-transparent">
            <TableHead className="font-display text-xs uppercase tracking-wider text-primary">Turret ID</TableHead>
            <TableHead className="font-display text-xs uppercase tracking-wider text-primary">Name</TableHead>
            <TableHead className="font-display text-xs uppercase tracking-wider text-primary">IP Address</TableHead>
            <TableHead className="font-display text-xs uppercase tracking-wider text-primary">Port</TableHead>
            <TableHead className="font-display text-xs uppercase tracking-wider text-primary">Channels</TableHead>
            <TableHead className="font-display text-xs uppercase tracking-wider text-primary">Status</TableHead>
            <TableHead className="font-display text-xs uppercase tracking-wider text-primary text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((turret) => (
            <TableRow key={turret.id} className="border-border/30 hover:bg-secondary/30">
              <TableCell className="font-mono text-sm text-foreground">{turret.turretId || turret.id}</TableCell>
              <TableCell className="font-semibold text-foreground">{turret.turretName}</TableCell>
              <TableCell className="font-mono text-sm text-muted-foreground">{turret.ip}</TableCell>
              <TableCell className="font-mono text-sm text-muted-foreground">{turret.port}</TableCell>
              <TableCell className="text-muted-foreground">{turret.noOfChannel || "-"}</TableCell>
              <TableCell>
                <Badge
                  variant={turret.isActive ? "default" : "destructive"}
                  className={turret.isActive 
                    ? "bg-success/20 text-success border-success/30 hover:bg-success/30" 
                    : "bg-destructive/20 text-destructive border-destructive/30 hover:bg-destructive/30"
                  }
                >
                  {turret.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(turret)}
                    className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(turret.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
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
  );
};

export default TurretTable;
