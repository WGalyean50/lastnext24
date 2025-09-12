import { useState, useCallback } from 'react';

/**
 * Hook for implementing optimistic UI updates
 * Allows UI to update immediately while API call is in progress
 */

export interface OptimisticState<T> {
  data: T;
  isOptimistic: boolean;
  isLoading: boolean;
  error: Error | null;
}

export interface OptimisticUpdateOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error, rollbackData: T) => void;
  rollbackDelay?: number; // Delay before rolling back on error
}

export function useOptimisticUpdate<T>(
  initialData: T
): {
  state: OptimisticState<T>;
  optimisticUpdate: (
    optimisticData: T,
    asyncOperation: () => Promise<T>,
    options?: OptimisticUpdateOptions<T>
  ) => Promise<void>;
  setState: (data: T) => void;
  clearError: () => void;
} {
  const [state, setState] = useState<OptimisticState<T>>({
    data: initialData,
    isOptimistic: false,
    isLoading: false,
    error: null
  });

  const optimisticUpdate = useCallback(
    async (
      optimisticData: T,
      asyncOperation: () => Promise<T>,
      options: OptimisticUpdateOptions<T> = {}
    ) => {
      const previousData = state.data;

      // Immediately update UI with optimistic data
      setState(prev => ({
        ...prev,
        data: optimisticData,
        isOptimistic: true,
        isLoading: true,
        error: null
      }));

      try {
        // Perform the async operation
        const result = await asyncOperation();

        // Update with real data on success
        setState(prev => ({
          ...prev,
          data: result,
          isOptimistic: false,
          isLoading: false,
          error: null
        }));

        options.onSuccess?.(result);
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error(String(error));

        if (options.rollbackDelay && options.rollbackDelay > 0) {
          // Delay rollback to show error state briefly
          setTimeout(() => {
            setState(prev => ({
              ...prev,
              data: previousData,
              isOptimistic: false,
              isLoading: false,
              error: errorObj
            }));
          }, options.rollbackDelay);
        } else {
          // Immediate rollback
          setState(prev => ({
            ...prev,
            data: previousData,
            isOptimistic: false,
            isLoading: false,
            error: errorObj
          }));
        }

        options.onError?.(errorObj, previousData);
        throw errorObj; // Re-throw for caller to handle if needed
      }
    },
    [state.data]
  );

  const setStateData = useCallback((data: T) => {
    setState(prev => ({
      ...prev,
      data,
      isOptimistic: false,
      isLoading: false,
      error: null
    }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null
    }));
  }, []);

  return {
    state,
    optimisticUpdate,
    setState: setStateData,
    clearError
  };
}

/**
 * Hook specifically for optimistic list operations
 */
export function useOptimisticList<T extends { id: string }>(
  initialList: T[]
): {
  list: T[];
  isLoading: boolean;
  error: Error | null;
  addOptimistic: (item: T, addFn: () => Promise<T>) => Promise<void>;
  updateOptimistic: (id: string, updates: Partial<T>, updateFn: () => Promise<T>) => Promise<void>;
  deleteOptimistic: (id: string, deleteFn: () => Promise<void>) => Promise<void>;
  setList: (list: T[]) => void;
  clearError: () => void;
} {
  const { state, optimisticUpdate, setState, clearError } = useOptimisticUpdate<T[]>(initialList);

  const addOptimistic = useCallback(
    async (item: T, addFn: () => Promise<T>) => {
      const optimisticList = [...state.data, item];
      
      await optimisticUpdate(
        optimisticList,
        async () => {
          const newItem = await addFn();
          return [...state.data, newItem];
        },
        {
          onError: (error, rollbackData) => {
            console.error('Failed to add item optimistically:', error);
          }
        }
      );
    },
    [state.data, optimisticUpdate]
  );

  const updateOptimistic = useCallback(
    async (id: string, updates: Partial<T>, updateFn: () => Promise<T>) => {
      const optimisticList = state.data.map(item =>
        item.id === id ? { ...item, ...updates } : item
      );

      await optimisticUpdate(
        optimisticList,
        async () => {
          const updatedItem = await updateFn();
          return state.data.map(item =>
            item.id === id ? updatedItem : item
          );
        },
        {
          onError: (error, rollbackData) => {
            console.error('Failed to update item optimistically:', error);
          }
        }
      );
    },
    [state.data, optimisticUpdate]
  );

  const deleteOptimistic = useCallback(
    async (id: string, deleteFn: () => Promise<void>) => {
      const optimisticList = state.data.filter(item => item.id !== id);

      await optimisticUpdate(
        optimisticList,
        async () => {
          await deleteFn();
          return state.data.filter(item => item.id !== id);
        },
        {
          onError: (error, rollbackData) => {
            console.error('Failed to delete item optimistically:', error);
          }
        }
      );
    },
    [state.data, optimisticUpdate]
  );

  return {
    list: state.data,
    isLoading: state.isLoading,
    error: state.error,
    addOptimistic,
    updateOptimistic,
    deleteOptimistic,
    setList: setState,
    clearError
  };
}

export default useOptimisticUpdate;