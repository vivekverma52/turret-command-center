import StatusPanel from "@/components/StatusPanel";
import ChannelCard from "@/components/ChannelCard";
import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";
import { useChannels } from "@/hooks/useChannels";
import { Radio, Zap, Phone, AlertTriangle } from "lucide-react";

const Index = () => {
  const { data: channels = [], isLoading, error } = useChannels();

  // Calculate stats from real data
  const uniqueTurrets = [...new Set(channels.map(c => c.turretName))].length;
  const activeChannels = channels.filter(c => c.isActive === true).length;
  const inactiveChannels = channels.filter(c => c.isActive === false).length;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="h-full bg-background px-4 md:px-6 py-6 md:py-8 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-display font-bold text-foreground mb-2">Failed to load channels</h2>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-background px-4 md:px-6 py-6 md:py-8">
      {/* Status Summary Panel */}
      <div className="max-w-4xl mx-auto mb-8">
        <StatusPanel
          items={[
            {
              label: "Total Turrets",
              value: channels.length,
              icon: Radio,
              iconColor: "text-primary",
              valueColor: "text-primary text-glow",
            },
            {
              label: "Active",
              value: activeChannels,
              icon: Zap,
              iconColor: "text-success",
              valueColor: "text-success",
            },
            {
              label: "Inactive",
              value: inactiveChannels,
              icon: Phone,
              iconColor: "text-destructive",
              valueColor: "text-destructive",
            },
          ]}
        />
      </div>

      {/* Channels Grid */}
      {channels.length === 0 ? (
        <div className="text-center py-12">
          <Radio className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-display font-bold text-foreground mb-2">No Channels Found</h3>
          <p className="text-muted-foreground">No channel data available from the server.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {channels.map((channel) => (
            <ChannelCard key={channel.id} channel={channel} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Index;
