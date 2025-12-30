import { useQuery } from "@tanstack/react-query";
import { apiFetch, ENDPOINTS } from "@/lib/api";

export interface Channel {
  id: number;
  turretName: string;
  partyNo: string;
  lineNo: string;
  deviceName: string;
  callId: string;
  state: string;
}

export const useChannels = () => {
  return useQuery({
    queryKey: ["channels"],
    queryFn: () => apiFetch<Channel[]>(ENDPOINTS.CHANNELS),
  });
};
