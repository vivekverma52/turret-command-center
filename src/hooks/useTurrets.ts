import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch, ENDPOINTS } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export interface Turret {
  id: string;
  turretId: string;
  turretName: string;
  ip: string;
  port: string;
  notificationIp: string;
  subscribePort: string;
  profileName: string;
  noOfChannel: string;
  isActive: boolean;
  isDeleted?: boolean;
}

export const useTurrets = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all turrets
  const {
    data: turrets = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Turret[]>({
    queryKey: ["turrets"],
    queryFn: () => apiFetch<Turret[]>(ENDPOINTS.TURRETS),
    refetchInterval: 5000,
  });

  // Add turret mutation
  const addTurretMutation = useMutation({
    mutationFn: (newTurret: Partial<Turret>) =>
      apiFetch<Turret>(ENDPOINTS.CREATE_TURRET, {
        method: "POST",
        body: JSON.stringify(newTurret),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["turrets"] });
      toast({
        title: "Turret added",
        description: `${data.turretName || "Turret"} has been created successfully.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add turret",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    },
  });

  // Update turret mutation
  const updateTurretMutation = useMutation({
    mutationFn: ({ id, updatedFields }: { id: string; updatedFields: Partial<Turret> }) =>
      apiFetch<Turret>(`${ENDPOINTS.UPDATE_TURRET}/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          id,
          ip: updatedFields.ip,
          turretName: updatedFields.turretName,
          notificationIp: updatedFields.notificationIp,
          port: updatedFields.port,
          profileName: updatedFields.profileName,
          subscribePort: updatedFields.subscribePort,
          noOfChannel: updatedFields.noOfChannel,
          isActive: updatedFields.isActive,
          isDeleted: updatedFields.isDeleted || false,
        }),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["turrets"] });
      toast({
        title: "Turret updated",
        description: `${data.turretName || "Turret"} has been updated successfully.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update turret",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    },
  });

  // Delete turret mutation
  const deleteTurretMutation = useMutation({
    mutationFn: (turretId: string) =>
      apiFetch(`${ENDPOINTS.DELETE_TURRET}/${turretId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["turrets"] });
      toast({
        title: "Turret deleted",
        description: "Turret has been deleted successfully.",
        variant: "destructive",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete turret",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    },
  });

  return {
    turrets,
    isLoading,
    error,
    refetch,
    addTurret: addTurretMutation.mutate,
    updateTurret: updateTurretMutation.mutate,
    deleteTurret: deleteTurretMutation.mutate,
    isAdding: addTurretMutation.isPending,
    isUpdating: updateTurretMutation.isPending,
    isDeleting: deleteTurretMutation.isPending,
  };
};
