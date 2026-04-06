'use client';

import { useCallback } from 'react';
import alert from '@/lib/alerts';

/**
 * Custom hook for using SweetAlert2 in React components
 * Provides all alert functions with proper React integration
 */
export const useSwal = () => {
  const success = useCallback(
    (title?: string, message?: string) => {
      return alert.success(title, message);
    },
    []
  );

  const error = useCallback(
    (title?: string, message?: string) => {
      return alert.error(title, message);
    },
    []
  );

  const warning = useCallback(
    (title?: string, message?: string) => {
      return alert.warning(title, message);
    },
    []
  );

  const info = useCallback(
    (title?: string, message?: string) => {
      return alert.info(title, message);
    },
    []
  );

  const confirm = useCallback(
    (title?: string, message?: string) => {
      return alert.confirm(title, message);
    },
    []
  );

  const loading = useCallback((title?: string, message?: string) => {
    return alert.loading(title, message);
  }, []);

  const close = useCallback(() => {
    return alert.close();
  }, []);

  const update = useCallback((options: any) => {
    return alert.update(options);
  }, []);

  const fire = useCallback((options: any) => {
    return alert.fire(options);
  }, []);

  return {
    success,
    error,
    warning,
    info,
    confirm,
    loading,
    close,
    update,
    fire,
  };
};

export default useSwal;
