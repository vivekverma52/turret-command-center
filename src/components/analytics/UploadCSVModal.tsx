import { useState } from "react";
import { Upload, FileSpreadsheet, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface UploadCSVModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (data: unknown) => void;
}

const UploadCSVModal = ({ isOpen, onClose, onSuccess }: UploadCSVModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "text/csv" || droppedFile.name.endsWith(".csv")) {
        setFile(droppedFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV file.",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file first.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulated upload - replace with actual API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast({
        title: "Upload successful",
        description: `${file.name} has been uploaded.`,
      });
      
      if (onSuccess) onSuccess({ fileName: file.name });
      setFile(null);
      onClose();
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "An error occurred while uploading the file.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card border-border/50">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            UPLOAD CSV
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Drag & Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`
              relative border-2 border-dashed rounded-lg p-8 text-center transition-all
              ${dragActive 
                ? "border-primary bg-primary/10" 
                : "border-border/50 hover:border-primary/50 hover:bg-secondary/30"
              }
            `}
          >
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            {file ? (
              <div className="flex flex-col items-center gap-3">
                <FileSpreadsheet className="h-12 w-12 text-primary" />
                <div className="flex items-center gap-2">
                  <span className="text-foreground font-medium">{file.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="p-1 hover:bg-destructive/20 rounded-full transition-colors"
                  >
                    <X className="h-4 w-4 text-destructive" />
                  </button>
                </div>
                <span className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(2)} KB
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <Upload className="h-12 w-12 text-muted-foreground" />
                <div>
                  <span className="text-foreground font-medium">Drop your CSV file here</span>
                  <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border/30">
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-border/50 text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={loading || !file}
            className="bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Uploading...
              </span>
            ) : (
              "Upload"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadCSVModal;
