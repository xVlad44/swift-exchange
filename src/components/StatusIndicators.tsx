import { Wifi, WifiOff, Clock, Shield, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface StatusIndicatorsProps {
  isDark: boolean;
  isOnline?: boolean;
  lastUpdated?: Date;
  apiStatus?: 'healthy' | 'degraded' | 'down';
}

const StatusIndicators = ({ 
  isDark, 
  isOnline = true, 
  lastUpdated = new Date(), 
  apiStatus = 'healthy' 
}: StatusIndicatorsProps) => {
  const getApiStatusColor = () => {
    switch (apiStatus) {
      case 'healthy': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'down': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getApiStatusText = () => {
    switch (apiStatus) {
      case 'healthy': return 'All systems operational';
      case 'degraded': return 'Experiencing delays';
      case 'down': return 'Service unavailable';
      default: return 'Unknown status';
    }
  };

  const formatLastUpdated = () => {
    const now = new Date();
    const diff = now.getTime() - lastUpdated.getTime();
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <div className="flex items-center gap-3 text-sm">
      {/* Network Status */}
      <Tooltip>
        <TooltipTrigger>
          <div className="flex items-center gap-1.5">
            {isOnline ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isOnline ? 'Connected to internet' : 'No internet connection'}</p>
        </TooltipContent>
      </Tooltip>

      {/* API Status */}
      <Tooltip>
        <TooltipTrigger>
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${getApiStatusColor()}`} />
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              API
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getApiStatusText()}</p>
        </TooltipContent>
      </Tooltip>

      {/* Last Updated */}
      <Tooltip>
        <TooltipTrigger>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-blue-500" />
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {formatLastUpdated()}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Last rate update: {lastUpdated.toLocaleTimeString()}</p>
        </TooltipContent>
      </Tooltip>

      {/* Security Badge */}
      <Tooltip>
        <TooltipTrigger>
          <Badge variant="outline" className="gap-1 text-xs">
            <Shield className="h-3 w-3" />
            Secure
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>Enterprise-grade security enabled</p>
        </TooltipContent>
      </Tooltip>

      {/* Performance Badge */}
      <Tooltip>
        <TooltipTrigger>
          <Badge variant="outline" className="gap-1 text-xs">
            <Zap className="h-3 w-3" />
            Fast
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>Real-time rate updates</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default StatusIndicators;
