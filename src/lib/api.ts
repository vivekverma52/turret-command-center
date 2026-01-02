// API Configuration
// export const API_BASE_URL = "http://14.194.159.19:8081";
export const API_BASE_URL = "http://14.194.159.19.8081";

// API Endpoints
export const ENDPOINTS = {
  // Audit Reports
  CALL_AUDIT: "/audit/getAllData",
  IP_PHONE_AUDIT: "/ipPhoneAdit/getAllData",
  IP_PHONE_DISCONNECT: "/ipPhoneDisconnect/getAllData",
  TURRET_DISCONNECT: "/turretDisconnect/getAllData",

  // Turret Management (Analytics)
  TURRETS: "/turrets",
  TURRETS_ACTIVE: "/turrets/active",
  CREATE_TURRET: "/turrets",
  UPDATE_TURRET: "/turrets",
  DELETE_TURRET: "/turrets",

  // Dashboard Channels
  CHANNELS: "/turrets",

  // Device Management
  DEVICES: "/ipPhones",
  CREATE_DEVICE: "/ipPhones",
  UPDATE_DEVICE: "/ipPhones",
  DELETE_DEVICE: "/ipPhones",
} as const;

// Helper function to build full URL
export const buildUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

// Generic fetch wrapper with error handling
export const apiFetch = async <T,>(endpoint: string, options?: RequestInit): Promise<T> => {
  const url = buildUrl(endpoint);

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};
