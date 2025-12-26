import { useState } from "react";
import { Plus, Upload, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import TurretTable, { type Turret } from "@/components/analytics/TurretTable";
import CreateTurretModal from "@/components/analytics/CreateTurretModal";
import UpdateTurretModal from "@/components/analytics/UpdateTurretModal";
import UploadCSVModal from "@/components/analytics/UploadCSVModal";
import { useToast } from "@/hooks/use-toast";

// Mock initial data
const initialTurrets: Turret[] = [
  {
    id: "1",
    turretId: "T001",
    turretName: "Turret Alpha",
    ip: "192.168.1.101",
    port: "8080",
    notificationIp: "192.168.1.200",
    subscribePort: "9090",
    profileName: "default_profile",
    noOfChannel: "2",
    isActive: true,
  },
  {
    id: "2",
    turretId: "T002",
    turretName: "Turret Bravo",
    ip: "192.168.1.102",
    port: "8080",
    notificationIp: "192.168.1.200",
    subscribePort: "9091",
    profileName: "tactical_profile",
    noOfChannel: "3",
    isActive: true,
  },
  {
    id: "3",
    turretId: "T003",
    turretName: "Turret Charlie",
    ip: "192.168.1.103",
    port: "8081",
    notificationIp: "192.168.1.201",
    subscribePort: "9092",
    profileName: "default_profile",
    noOfChannel: "2",
    isActive: false,
  },
];

const emptyTurret: Partial<Turret> = {
  turretId: "",
  turretName: "",
  ip: "",
  port: "",
  notificationIp: "",
  subscribePort: "",
  profileName: "default_profile",
  noOfChannel: "",
  isActive: false,
};

const Analytics = () => {
  const [turrets, setTurrets] = useState<Turret[]>(initialTurrets);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingTurret, setEditingTurret] = useState<Turret | null>(null);
  const [newTurret, setNewTurret] = useState<Partial<Turret>>(emptyTurret);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    if (editingTurret) {
      setEditingTurret({ ...editingTurret, [name]: newValue });
    } else {
      setNewTurret({ ...newTurret, [name]: newValue });
    }
  };

  const handleCreate = () => {
    const turret: Turret = {
      id: Date.now().toString(),
      turretId: newTurret.turretId || `T${Date.now()}`,
      turretName: newTurret.turretName || "",
      ip: newTurret.ip || "",
      port: newTurret.port || "",
      notificationIp: newTurret.notificationIp || "",
      subscribePort: newTurret.subscribePort || "",
      profileName: newTurret.profileName || "default_profile",
      noOfChannel: newTurret.noOfChannel || "",
      isActive: newTurret.isActive || false,
    };

    setTurrets([...turrets, turret]);
    setNewTurret(emptyTurret);
    setIsCreateModalOpen(false);
    
    toast({
      title: "Turret created",
      description: `${turret.turretName} has been created successfully.`,
    });
  };

  const handleUpdate = () => {
    if (!editingTurret) return;

    setTurrets(turrets.map((t) => 
      t.id === editingTurret.id ? editingTurret : t
    ));
    setEditingTurret(null);
    
    toast({
      title: "Turret updated",
      description: `${editingTurret.turretName} has been updated successfully.`,
    });
  };

  const handleDelete = (id: string) => {
    const turret = turrets.find((t) => t.id === id);
    setTurrets(turrets.filter((t) => t.id !== id));
    
    toast({
      title: "Turret deleted",
      description: turret ? `${turret.turretName} has been deleted.` : "Turret deleted.",
      variant: "destructive",
    });
  };

  const handleEdit = (turret: Turret) => {
    setEditingTurret({ ...turret });
  };

  const handleUploadSuccess = () => {
    toast({
      title: "CSV uploaded",
      description: "Turret data has been imported successfully.",
    });
  };

  return (
    <div className="h-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
            <Radio className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-wider text-foreground">
              Turret Management
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage and configure your turret systems
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Turret
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsUploadModalOpen(true)}
            className="border-success/50 text-success hover:bg-success/10 hover:text-success"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload CSV
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-card border border-border/30">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Total Turrets</p>
          <p className="text-2xl font-display font-bold text-primary text-glow">{turrets.length}</p>
        </div>
        <div className="p-4 rounded-lg bg-card border border-border/30">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Active</p>
          <p className="text-2xl font-display font-bold text-success">{turrets.filter(t => t.isActive).length}</p>
        </div>
        <div className="p-4 rounded-lg bg-card border border-border/30">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Inactive</p>
          <p className="text-2xl font-display font-bold text-destructive">{turrets.filter(t => !t.isActive).length}</p>
        </div>
        <div className="p-4 rounded-lg bg-card border border-border/30">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Total Channels</p>
          <p className="text-2xl font-display font-bold text-foreground">
            {turrets.reduce((acc, t) => acc + (parseInt(t.noOfChannel) || 0), 0)}
          </p>
        </div>
      </div>

      {/* Turret Table */}
      <TurretTable
        turrets={turrets}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modals */}
      <CreateTurretModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setNewTurret(emptyTurret);
        }}
        turretData={newTurret}
        handleChange={handleChange}
        handleSubmit={handleCreate}
      />

      {editingTurret && (
        <UpdateTurretModal
          isOpen={!!editingTurret}
          onClose={() => setEditingTurret(null)}
          turretData={editingTurret}
          handleChange={handleChange}
          handleSubmit={handleUpdate}
        />
      )}

      <UploadCSVModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
};

export default Analytics;
