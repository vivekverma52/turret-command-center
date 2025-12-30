import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { Turret } from "@/hooks/useTurrets";

interface CreateTurretModalProps {
  isOpen: boolean;
  onClose: () => void;
  turretData: Partial<Turret>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
}

const CreateTurretModal = ({ isOpen, onClose, turretData, handleChange, handleSubmit }: CreateTurretModalProps) => {
  const handleSwitchChange = (checked: boolean) => {
    const event = {
      target: {
        name: "isActive",
        type: "checkbox",
        checked,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    handleChange(event);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-card border-border/50 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {turretData.turretId ? "EDIT TURRET" : "CREATE TURRET"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Row 1: Turret ID & Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm">Turret Name</Label>
              <Input
                name="turretName"
                value={turretData.turretName || ""}
                onChange={handleChange}
                placeholder="Enter Turret Name"
                className="bg-secondary/50 border-border/50 focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm">IP Address</Label>
              <Input
                name="ip"
                value={turretData.ip || ""}
                onChange={handleChange}
                placeholder="Enter IP Address"
                className="bg-secondary/50 border-border/50 focus:border-primary"
              />
            </div>
          </div>

          {/* Row 2: IP & Port */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm">Port</Label>
              <Input
                type="number"
                name="port"
                value={turretData.port || ""}
                onChange={handleChange}
                placeholder="Enter Port"
                className="bg-secondary/50 border-border/50 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm">Notification IP</Label>
              <Input
                name="notificationIp"
                value={turretData.notificationIp || ""}
                onChange={handleChange}
                placeholder="Enter Notification IP"
                className="bg-secondary/50 border-border/50 focus:border-primary"
              />
            </div>
          </div>

          {/* Row 3: Notification IP & Subscribe Port */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm">Subscribe Port</Label>
              <Input
                type="number"
                name="subscribePort"
                value={turretData.subscribePort || ""}
                onChange={handleChange}
                placeholder="Enter Subscribe Port"
                className="bg-secondary/50 border-border/50 focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm">Profile Name</Label>
              <Input
                name="profileName"
                value={turretData.profileName || ""}
                onChange={handleChange}
                placeholder="Enter Profile Name"
                className="bg-secondary/50 border-border/50 focus:border-primary"
              />
            </div>
          </div>

          {/* Row 4: Profile Name & Channels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm">Number of Channels</Label>
              <Input
                type="number"
                name="noOfChannel"
                value={turretData.noOfChannel || ""}
                onChange={handleChange}
                placeholder="Enter Number of Channels"
                min="1"
                className="bg-secondary/50 border-border/50 focus:border-primary"
              />
            </div>
          </div>

          {/* Active Status Toggle */}
          <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg border border-border/30">
            <Label className="text-muted-foreground text-sm">Active Status</Label>
            <div className="flex items-center gap-3">
              <Switch
                checked={turretData.isActive || false}
                onCheckedChange={handleSwitchChange}
                className="data-[state=checked]:bg-primary"
              />
              <span
                className={`text-sm font-semibold ${turretData.isActive ? "text-success" : "text-muted-foreground"}`}
              >
                {turretData.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border/30">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan">
            {turretData.turretId ? "Update" : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTurretModal;
