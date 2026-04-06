'use client';

import { ReactNode, useEffect } from 'react';
import Swal from 'sweetalert2';

/**
 * AlertProvider component
 * Wraps the app and provides global SweetAlert2 configuration and styling
 */
export function AlertProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Global SweetAlert2 configuration
    Swal.mixin({
      allowOutsideClick: true,
      allowEscapeKey: true,
      didOpen(popup) {
        // Apply custom styles when alert opens
        applyCustomStyles(popup);
      },
    });

    // Add custom CSS for better dark theme support
    addCustomStyles();
  }, []);

  return <>{children}</>;
}

/**
 * Apply custom styles to SweetAlert2 popup
 */
function applyCustomStyles(popup: HTMLElement) {
  popup.classList.add('swal-custom-popup');

  // Make popup responsive
  if (window.innerWidth < 640) {
    popup.style.width = '90vw';
    popup.style.maxWidth = '400px';
  }
}

/**
 * Add global CSS styles for SweetAlert2
 */
function addCustomStyles() {
  if (document.getElementById('swal-custom-styles')) {
    return; // Already added
  }

  const style = document.createElement('style');
  style.id = 'swal-custom-styles';
  style.textContent = `
    /* SweetAlert2 Custom Styles */
    .swal2-container {
      z-index: 9999;
    }

    .swal2-popup {
      background: rgb(17 24 39); /* Dark background */
      color: rgb(229 231 235); /* Light text */
      border-radius: 0.75rem;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
    }

    .dark .swal2-popup {
      background: rgb(17 24 39);
      color: rgb(229 231 235);
    }

    .light .swal2-popup {
      background: rgb(255, 255, 255);
      color: rgb(17 24 39);
    }

    .swal2-title {
      color: rgb(229 231 235);
      font-size: 1.5rem;
      font-weight: 600;
    }

    .light .swal2-title {
      color: rgb(17 24 39);
    }

    .swal2-html-container {
      color: rgb(209 213 219);
      font-size: 1rem;
      line-height: 1.5;
    }

    .light .swal2-html-container {
      color: rgb(55 65 81);
    }

    .swal2-confirm {
      background: #3b82f6; /* Primary blue */
      border: none;
      border-radius: 0.5rem;
      padding: 0.75rem 1.5rem;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .swal2-confirm:hover {
      background: #2563eb;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }

    .swal2-confirm:active {
      transform: translateY(0);
    }

    .swal2-cancel {
      background: rgb(75, 85, 99); /* Gray background */
      border: none;
      border-radius: 0.5rem;
      padding: 0.75rem 1.5rem;
      font-weight: 600;
      color: rgb(229 231 235);
      transition: all 0.3s ease;
    }

    .swal2-cancel:hover {
      background: rgb(55, 65, 81);
    }

    .light .swal2-cancel {
      background: rgb(209 213 219);
      color: rgb(17 24 39);
    }

    .light .swal2-cancel:hover {
      background: rgb(156 163 175);
    }

    .swal2-icon {
      width: 3rem;
      height: 3rem;
    }

    .swal2-icon.swal2-success {
      border-color: #10b981; /* Green */
    }

    .swal2-icon.swal2-success .swal2-success-ring {
      border-color: #10b981;
    }

    .swal2-icon.swal2-error {
      border-color: #ef4444; /* Red */
    }

    .swal2-icon.swal2-warning {
      border-color: #f59e0b; /* Amber */
    }

    .swal2-icon.swal2-info {
      border-color: #3b82f6; /* Blue */
    }

    .swal2-icon.swal2-question {
      border-color: #3b82f6; /* Blue */
    }

    /* Loading spinner styling */
    .swal2-loading * {
      border-color: #3b82f6 !important;
    }

    .swal2-loading::after {
      border-color: #3b82f6 transparent #3b82f6 transparent !important;
    }

    /* Responsive styles */
    @media (max-width: 640px) {
      .swal2-popup {
        width: 90vw;
        max-width: 400px;
        margin: 0 auto;
      }

      .swal2-title {
        font-size: 1.25rem;
      }

      .swal2-html-container {
        font-size: 0.95rem;
      }

      .swal2-confirm,
      .swal2-cancel {
        padding: 0.625rem 1.25rem;
        font-size: 0.95rem;
      }
    }

    /* Input styling */
    .swal2-input {
      background: rgb(31 41 55);
      border: 1px solid rgb(75 85 99);
      color: rgb(229 231 235);
      border-radius: 0.375rem;
      padding: 0.5rem 0.75rem;
    }

    .swal2-input:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .light .swal2-input {
      background: rgb(249 250 251);
      border: 1px solid rgb(209 213 219);
      color: rgb(17 24 39);
    }

    .light .swal2-input:focus {
      border-color: #3b82f6;
    }

    /* Custom alert button styles */
    .sweetalert-confirm-btn {
      background: #3b82f6 !important;
      color: white !important;
      border: none !important;
      border-radius: 0.5rem !important;
    }

    .sweetalert-confirm-btn:hover {
      background: #2563eb !important;
    }

    .sweetalert-cancel-btn {
      background: rgb(75, 85, 99) !important;
      color: rgb(229 231 235) !important;
      border: none !important;
      border-radius: 0.5rem !important;
    }

    .sweetalert-cancel-btn:hover {
      background: rgb(55, 65, 81) !important;
    }
  `;

  document.head.appendChild(style);
}

export default AlertProvider;
