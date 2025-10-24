import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

// Use a simple random string for keys if uuid is not available via import map
const generateId = () => Math.random().toString(36).substring(2, 9);

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface NotificationContextType {
  addNotification: (notification: Omit<Notification, 'id'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: any) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = generateId();
    setNotifications(prev => [...prev, { ...notification, id }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] w-full max-w-xs space-y-2">
        {notifications.map(n => (
          <NotificationToast key={n.id} notification={n} onClose={() => removeNotification(n.id)} />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

const NotificationToast: React.FC<{ notification: Notification; onClose: () => void }> = ({ notification, onClose }) => {
    const baseClasses = "relative w-full rounded-md shadow-lg p-3 pr-8 text-sm animate-fade-in border";
    const colorClasses = {
        success: "bg-green-100/80 backdrop-blur-sm text-green-900 border-green-200 dark:bg-green-900/80 dark:text-green-100 dark:border-green-700",
        error: "bg-red-100/80 backdrop-blur-sm text-red-900 border-red-200 dark:bg-red-900/80 dark:text-red-100 dark:border-red-700",
        info: "bg-blue-100/80 backdrop-blur-sm text-blue-900 border-blue-200 dark:bg-blue-900/80 dark:text-blue-100 dark:border-blue-700"
    };

    return (
        <div className={`${baseClasses} ${colorClasses[notification.type]}`} role="alert">
            {notification.message}
            <button onClick={onClose} className="absolute top-1/2 right-2 -translate-y-1/2 p-1 rounded-full hover:bg-black/10 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
    );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
