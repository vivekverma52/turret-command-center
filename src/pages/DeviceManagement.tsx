import { useState } from "react";
import { Plus, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDevices, type Device } from "@/hooks/useDevices";
import DeviceTable from "@/components/devices/DeviceTable";
import CreateDeviceModal from "@/components/devices/CreateDeviceModal";
import UpdateDeviceModal from "@/components/devices/UpdateDeviceModal";
import AnalyticsSkeleton from "@/components/skeletons/AnalyticsSkeleton";

const emptyDevice: Partial<Device> = {
  deviceIdentifier: "",
  displayNumber: "",
  phoneName: "",
};

const DeviceManagement = () => {
  const { devices, isLoading, error, addDevice, updateDevice, deleteDevice, refetch } = useDevices();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [newDevice, setNewDevice] = useState<Partial<Device>>(emptyDevice);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);

  // Track when initial load completes (success or error)
  if (!isLoading && !hasInitiallyLoaded) {
    setHasInitiallyLoaded(true);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingDevice) {
      setEditingDevice({ ...editingDevice, [name]: value });
    } else {
      setNewDevice({ ...newDevice, [name]: value });
    }
  };

  const handleCreate = () => {
    addDevice(newDevice);
    setIsCreateModalOpen(false);
    setNewDevice(emptyDevice);
  };

  const handleUpdate = () => {
    if (editingDevice) {
      updateDevice({
        id: editingDevice.id,
        updatedFields: editingDevice,
      });
      setEditingDevice(null);
    }
  };

  const handleDelete = (id: string) => {
    deleteDevice(id);
  };

  const handleEdit = (device: Device) => {
    setEditingDevice(device);
  };

  if (isLoading && !hasInitiallyLoaded) {
    return <AnalyticsSkeleton />;
  }

  const totalDevices = devices.length;
  const activeDevices = devices.filter((d) => d.isActive).length;
  const inactiveDevices = totalDevices - activeDevices;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground tracking-wider flex items-center gap-3">
            <Smartphone className="w-7 h-7 text-primary" />
            Device Management
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage and configure device models
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Device
        </Button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card/50 border border-border/30 rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Total Devices</div>
          <div className="text-2xl font-bold text-foreground">{totalDevices}</div>
        </div>
        <div className="bg-card/50 border border-border/30 rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Active</div>
          <div className="text-2xl font-bold text-success">{activeDevices}</div>
        </div>
        <div className="bg-card/50 border border-border/30 rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Inactive</div>
          <div className="text-2xl font-bold text-destructive">{inactiveDevices}</div>
        </div>
      </div>

      {/* Device Table */}
      <DeviceTable
        devices={devices}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Create Modal */}
      <CreateDeviceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        deviceData={newDevice}
        handleChange={handleChange}
        handleSubmit={handleCreate}
      />

      {/* Update Modal */}
      {editingDevice && (
        <UpdateDeviceModal
          isOpen={!!editingDevice}
          onClose={() => setEditingDevice(null)}
          deviceData={editingDevice}
          handleChange={handleChange}
          handleSubmit={handleUpdate}
        />
      )}
    </div>
  );
};

export default DeviceManagement;
