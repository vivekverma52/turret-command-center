import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch, ENDPOINTS } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export interface Device {
  id: string;
  deviceIdentifier: string;
  displayNumber: string;
  phoneName: string;
  isActive?: boolean;
  createDate?: string;
}

export const useDevices = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all devices
  const {
    data: devices = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Device[]>({
    queryKey: ["devices"],
    queryFn: () => apiFetch<Device[]>(ENDPOINTS.DEVICES),
    refetchInterval: 5000,
  });

  // Add device mutation
  const addDeviceMutation = useMutation({
    mutationFn: (newDevice: Partial<Device>) =>
      apiFetch<Device>(ENDPOINTS.CREATE_DEVICE, {
        method: "POST",
        body: JSON.stringify(newDevice),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });
      toast({
        title: "Device added",
        description: `${data.phoneName || "Device"} has been created successfully.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add device",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    },
  });

  // Update device mutation
  const updateDeviceMutation = useMutation({
    mutationFn: ({ id, updatedFields }: { id: string; updatedFields: Partial<Device> }) =>
      apiFetch<Device>(`${ENDPOINTS.UPDATE_DEVICE}/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          id,
          deviceIdentifier: updatedFields.deviceIdentifier,
          displayNumber: updatedFields.displayNumber,
          phoneName: updatedFields.phoneName,
          isActive: updatedFields.isActive,
          createDate: updatedFields.createDate,
        }),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });
      toast({
        title: "Device updated",
        description: `${data.phoneName || "Device"} has been updated successfully.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update device",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    },
  });

  // Delete device mutation
  const deleteDeviceMutation = useMutation({
    mutationFn: (deviceId: string) =>
      apiFetch(`${ENDPOINTS.DELETE_DEVICE}/${deviceId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });
      toast({
        title: "Device deleted",
        description: "Device has been deleted successfully.",
        variant: "destructive",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete device",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    },
  });

  return {
    devices,
    isLoading,
    error,
    refetch,
    addDevice: addDeviceMutation.mutate,
    updateDevice: updateDeviceMutation.mutate,
    deleteDevice: deleteDeviceMutation.mutate,
    isAdding: addDeviceMutation.isPending,
    isUpdating: updateDeviceMutation.isPending,
    isDeleting: deleteDeviceMutation.isPending,
  };
};
