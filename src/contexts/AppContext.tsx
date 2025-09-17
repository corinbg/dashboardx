import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Request, Client, ChecklistItem } from '../types';
import { getRequests, updateRequestStatus } from '../services/requestsService';
import { getClients } from '../services/clientsService';
import { getChecklistItems, createChecklistItem as createChecklistItemService, toggleChecklistItem as toggleChecklistItemService } from '../services/checklistService';

interface AppContextType {
  requests: Request[];
  clients: Client[];
  checklist: ChecklistItem[];
  loading: boolean;
  addChecklistItem: (text: string) => Promise<void>;
  toggleChecklistItem: (id: string) => Promise<void>;
  updateRequestStatus: (id: string, status: Request['stato']) => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    // Only fetch data if user is authenticated
    if (!user) {
      console.log('No authenticated user, skipping data fetch');
      return;
    }

    setLoading(true);
    try {
      const [requestsData, clientsData, checklistData] = await Promise.all([
        getRequests(),
        getClients(),
        getChecklistItems(),
      ]);
      
      setRequests(requestsData);
      setClients(clientsData);
      setChecklist(checklistData);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) {
      // Still determining authentication state, wait
      return;
    }

    if (!user) {
      // User not authenticated, clear data and stop loading
      setRequests([]);
      setClients([]);
      setChecklist([]);
      setLoading(false);
      return;
    }

    // User is authenticated, fetch data
    refreshData();
  }, [authLoading, user]);

  const addChecklistItem = async (text: string) => {
    const newItemId = await createChecklistItemService(text);
    if (newItemId) {
      await refreshData();
    }
  };

  const toggleChecklistItem = async (id: string) => {
    const item = checklist.find(item => item.id === id);
    if (item) {
      const success = await toggleChecklistItemService(id, !item.completata);
      if (success) {
        await refreshData();
      }
    }
  };

  const updateRequestStatusHandler = async (id: string, status: Request['stato']) => {
    const success = await updateRequestStatus(id, status);
    if (success) {
      await refreshData();
    }
  };

  return (
    <AppContext.Provider value={{
      requests,
      clients,
      checklist,
      loading,
      addChecklistItem,
      toggleChecklistItem,
      updateRequestStatus: updateRequestStatusHandler,
      refreshData,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}