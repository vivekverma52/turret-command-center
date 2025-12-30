import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type Device } from "@/hooks/useDevices";

interface UpdateDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  deviceData: Device;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
}

const UpdateDeviceModal = ({
  isOpen,
  onClose,
  deviceData,
  handleChange,
  handleSubmit,
}: UpdateDeviceModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-card border-border/50">
        <DialogHeader>
          <DialogTitle className="font-display text-xl tracking-wider text-primary">
            Edit Device
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="deviceIdentifier" className="text-sm font-medium text-muted-foreground">
              Device Identifier
            </Label>
            <Input
              id="deviceIdentifier"
              name="deviceIdentifier"
              value={deviceData.deviceIdentifier || ""}
              onChange={handleChange}
              placeholder="Enter Device Identifier"
              className="bg-secondary/50 border-border/50 focus:border-primary"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="displayNumber" className="text-sm font-medium text-muted-foreground">
              Display Number
            </Label>
            <Input
              id="displayNumber"
              name="displayNumber"
              value={deviceData.displayNumber || ""}
              onChange={handleChange}
              placeholder="Enter Display Number"
              className="bg-secondary/50 border-border/50 focus:border-primary"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phoneName" className="text-sm font-medium text-muted-foreground">
              Phone Name
            </Label>
            <Input
              id="phoneName"
              name="phoneName"
              value={deviceData.phoneName || ""}
              onChange={handleChange}
              placeholder="Enter Phone Name"
              className="bg-secondary/50 border-border/50 focus:border-primary"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-border/50 hover:bg-secondary/50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateDeviceModal;
