import Swal from 'sweetalert2';

/**
 * Pre-configured SweetAlert2 utility functions for consistent alerts across the app
 */

// Default configuration for all alerts
const defaultConfig = {
  allowOutsideClick: true,
  allowEscapeKey: true,
  confirmButtonColor: '#3b82f6', // primary color
  cancelButtonColor: '#ef4444', // red
};

/**
 * Success alert
 */
export const alertSuccess = (
  title: string = 'Sukses!',
  message: string = ''
) => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'success',
    title,
    html: message,
  } as any);
};

/**
 * Error alert
 */
export const alertError = (
  title: string = 'Error!',
  message: string = ''
) => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'error',
    title,
    html: message,
  } as any);
};

/**
 * Warning alert
 */
export const alertWarning = (
  title: string = 'Peringatan!',
  message: string = ''
) => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'warning',
    title,
    html: message,
  } as any);
};

/**
 * Info alert
 */
export const alertInfo = (
  title: string = 'Informasi',
  message: string = ''
) => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'info',
    title,
    html: message,
  } as any);
};

/**
 * Confirmation dialog
 * Returns a Promise that resolves to true if confirmed, false if cancelled
 */
export const alertConfirm = (
  title: string = 'Konfirmasi',
  message: string = ''
): Promise<boolean> => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'question',
    title,
    html: message,
    showCancelButton: true,
    confirmButtonText: 'Ya',
    cancelButtonText: 'Batal',
  } as any).then((result) => result.isConfirmed);
};

/**
 * Loading/Processing alert
 * Shows an alert with a loading spinner
 */
export const alertLoading = (
  title: string = 'Memproses...',
  message: string = ''
) => {
  return Swal.fire({
    ...defaultConfig,
    title,
    html: message,
    icon: 'info',
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: async () => {
      Swal.showLoading();
    },
  } as any);
};

/**
 * Close any open alert
 */
export const alertClose = () => {
  return Swal.close();
};

/**
 * Update existing alert
 */
export const alertUpdate = (options: any) => {
  return Swal.update(options);
};

/**
 * Raw SweetAlert2 - for custom configurations
 */
export const alertFire = (options: any) => {
  return Swal.fire({
    ...defaultConfig,
    ...options,
  } as any);
};

/**
 * Convenience object for using alerts like: alert.success(), alert.error(), etc.
 */
export const alert = {
  success: alertSuccess,
  error: alertError,
  warning: alertWarning,
  info: alertInfo,
  confirm: alertConfirm,
  loading: alertLoading,
  close: alertClose,
  update: alertUpdate,
  fire: alertFire,
};

export default alert;
