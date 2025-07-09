import React from 'react';
import { 
  IconCheck, 
  IconExclamationCircle, 
  IconAlertTriangle, 
  IconInfoCircle,
  IconX 
} from '@tabler/icons-react';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
  showIcon?: boolean;
  closable?: boolean;
}

const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  onClose,
  className = '',
  showIcon = true,
  closable = true
}) => {
  const getAlertStyles = () => {
    const baseStyles = 'relative p-4 rounded-lg border flex items-start gap-3 transition-all duration-300';
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-50 border-green-200 text-green-800`;
      case 'error':
        return `${baseStyles} bg-red-50 border-red-200 text-red-800`;
      case 'warning':
        return `${baseStyles} bg-yellow-50 border-yellow-200 text-yellow-800`;
      case 'info':
        return `${baseStyles} bg-blue-50 border-blue-200 text-blue-800`;
      default:
        return `${baseStyles} bg-gray-50 border-gray-200 text-gray-800`;
    }
  };

  const getIcon = () => {
    const iconProps = { size: 20, className: 'flex-shrink-0 mt-0.5' };
    
    switch (type) {
      case 'success':
        return <IconCheck {...iconProps} className={`${iconProps.className} text-green-600`} />;
      case 'error':
        return <IconExclamationCircle {...iconProps} className={`${iconProps.className} text-red-600`} />;
      case 'warning':
        return <IconAlertTriangle {...iconProps} className={`${iconProps.className} text-yellow-600`} />;
      case 'info':
        return <IconInfoCircle {...iconProps} className={`${iconProps.className} text-blue-600`} />;
      default:
        return null;
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-600 hover:text-green-800';
      case 'error':
        return 'text-red-600 hover:text-red-800';
      case 'warning':
        return 'text-yellow-600 hover:text-yellow-800';
      case 'info':
        return 'text-blue-600 hover:text-blue-800';
      default:
        return 'text-gray-600 hover:text-gray-800';
    }
  };

  return (
    <div className={`${getAlertStyles()} ${className}`}>
      {showIcon && getIcon()}
      
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="font-semibold text-sm mb-1">
            {title}
          </h4>
        )}
        <p className="text-sm leading-relaxed">
          {message}
        </p>
      </div>
      
      {closable && onClose && (
        <button
          onClick={onClose}
          className={`flex-shrink-0 ml-2 p-1 rounded-full hover:bg-black/10 transition-colors duration-200 ${getIconColor()}`}
          aria-label="Close alert"
        >
          <IconX size={16} />
        </button>
      )}
    </div>
  );
};

export default Alert;

export const useAlert = () => {
  const [alerts, setAlerts] = React.useState<Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title?: string;
    message: string;
    duration?: number;
  }>>([]);

  const showAlert = React.useCallback((
    type: 'success' | 'error' | 'warning' | 'info',
    message: string,
    title?: string,
    duration: number = 5000
  ) => {
    const id = Date.now().toString();
    
    setAlerts(prev => [...prev, { id, type, title, message, duration }]);
    
    if (duration > 0) {
      setTimeout(() => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
      }, duration);
    }
  }, []);

  const removeAlert = React.useCallback((id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const clearAll = React.useCallback(() => {
    setAlerts([]);
  }, []);

  return {
    alerts,
    showAlert,
    removeAlert,
    clearAll,
    success: (message: string, title?: string, duration?: number) => 
      showAlert('success', message, title, duration),
    error: (message: string, title?: string, duration?: number) => 
      showAlert('error', message, title, duration),
    warning: (message: string, title?: string, duration?: number) => 
      showAlert('warning', message, title, duration),
    info: (message: string, title?: string, duration?: number) => 
      showAlert('info', message, title, duration),
  };
};

interface AlertContainerProps {
  alerts: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title?: string;
    message: string;
  }>;
  onRemove: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export const AlertContainer: React.FC<AlertContainerProps> = ({
  alerts,
  onRemove,
  position = 'top-right'
}) => {
  const getPositionStyles = () => {
    const baseStyles = 'fixed z-50 max-w-md w-full pointer-events-auto';
    
    switch (position) {
      case 'top-right':
        return `${baseStyles} top-4 right-4`;
      case 'top-left':
        return `${baseStyles} top-4 left-4`;
      case 'bottom-right':
        return `${baseStyles} bottom-4 right-4`;
      case 'bottom-left':
        return `${baseStyles} bottom-4 left-4`;
      case 'top-center':
        return `${baseStyles} top-4 left-1/2 transform -translate-x-1/2`;
      case 'bottom-center':
        return `${baseStyles} bottom-4 left-1/2 transform -translate-x-1/2`;
      default:
        return `${baseStyles} top-4 right-4`;
    }
  };

  if (alerts.length === 0) return null;

  return (
    <div className={getPositionStyles()}>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="animate-in slide-in-from-right-full duration-300"
          >
            <Alert
              type={alert.type}
              title={alert.title}
              message={alert.message}
              onClose={() => onRemove(alert.id)}
              className="shadow-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
};