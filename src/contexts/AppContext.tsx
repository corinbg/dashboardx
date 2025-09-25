import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Request, Client, ChecklistItem } from '../types';
import { getRequests, updateRequestStatus } from '../services/requestsService';
import { getClients } from '../services/clientsService';
import { 
  getChecklistItems, 
  createChecklistItem as createChecklistItemService, 
  createAdvancedChecklistItem as createAdvancedChecklistItemService,
  updateChecklistItem as updateChecklistItemService,
  deleteChecklistItem as deleteChecklistItemService,
  toggleChecklistItem as toggleChecklistItemService 
} from '../services/checklistService';

interface AppContextType {
  requests: Request[];
  clients: Client[];
  checklist: ChecklistItem[];
  loading: boolean;
  addChecklistItem: (text: string) => Promise<void>;
  addAdvancedChecklistItem: (item: {
    testo: string;
    priorita?: string;
    categoria?: string;
    categoriaCustom?: string;
    dataScadenza?: string;
    dataPromemoria?: string;
    ricorrente?: string;
  }) => Promise<void>;
  updateChecklistItem: (id: string, updates: {
    testo?: string;
    priorita?: string;
    categoria?: string;
    categoriaCustom?: string;
    dataScadenza?: string;
    dataPromemoria?: string;
    ricorrente?: string;
  }) => Promise<void>;
  deleteChecklistItem: (id: string) => Promise<void>;
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

  const addAdvancedChecklistItem = async (item: {
    testo: string;
    priorita?: string;
    categoria?: string;
    categoriaCustom?: string;
    dataScadenza?: string;
    dataPromemoria?: string;
    ricorrente?: string;
  }) => {
    const newItemId = await createAdvancedChecklistItemService(item);
    if (newItemId) {
      await refreshData();
    }
  };

  const updateChecklistItemHandler = async (id: string, updates: {
    testo?: string;
    priorita?: string;
    categoria?: string;
    categoriaCustom?: string;
    dataScadenza?: string;
    dataPromemoria?: string;
    ricorrente?: string;
  }) => {
    const success = await updateChecklistItemService(id, updates);
    if (success) {
      await refreshData();
    }
  };

  const deleteChecklistItemHandler = async (id: string) => {
    const success = await deleteChecklistItemService(id);
    if (success) {
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
      addAdvancedChecklistItem,
      updateChecklistItem: updateChecklistItemHandler,
      deleteChecklistItem: deleteChecklistItemHandler,
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