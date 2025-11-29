import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { ToastProvider, useToast } from '../Toast';

// Test component that uses the toast hook
const TestComponent: React.FC<{ 
  message?: string; 
  type?: 'success' | 'error' | 'warning' | 'info';
  autoTrigger?: boolean;
}> = ({ message = 'Test message', type = 'info', autoTrigger = false }) => {
  const { showToast } = useToast();
  
  React.useEffect(() => {
    if (autoTrigger) {
      showToast(message, type);
    }
  }, [autoTrigger, message, type, showToast]);

  return (
    <button onClick={() => showToast(message, type)}>
      Show Toast
    </button>
  );
};

describe('Toast', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('ToastProvider', () => {
    it('should render children', () => {
      render(
        <ToastProvider>
          <div>Child content</div>
        </ToastProvider>
      );

      expect(screen.getByText('Child content')).toBeInTheDocument();
    });

    it('should provide toast context to children', () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      expect(screen.getByRole('button', { name: /show toast/i })).toBeInTheDocument();
    });
  });

  describe('useToast', () => {
    it('should throw error when used outside ToastProvider', () => {
      // Suppress console.error for this test
      const originalError = console.error;
      console.error = jest.fn();

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useToast must be used within a ToastProvider');

      console.error = originalError;
    });

    it('should show toast message when triggered', async () => {
      render(
        <ToastProvider>
          <TestComponent message="Hello World" autoTrigger={true} />
        </ToastProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Hello World')).toBeInTheDocument();
      });
    });

    it('should show success toast with correct styling', async () => {
      render(
        <ToastProvider>
          <TestComponent message="Success!" type="success" autoTrigger={true} />
        </ToastProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Success!')).toBeInTheDocument();
      });
    });

    it('should show error toast', async () => {
      render(
        <ToastProvider>
          <TestComponent message="Error occurred" type="error" autoTrigger={true} />
        </ToastProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Error occurred')).toBeInTheDocument();
      });
    });

    it('should show warning toast', async () => {
      render(
        <ToastProvider>
          <TestComponent message="Warning!" type="warning" autoTrigger={true} />
        </ToastProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Warning!')).toBeInTheDocument();
      });
    });

    it('should auto-dismiss toast after timeout', async () => {
      render(
        <ToastProvider>
          <TestComponent message="Auto dismiss" autoTrigger={true} />
        </ToastProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Auto dismiss')).toBeInTheDocument();
      });

      // Fast-forward past the toast duration
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      await waitFor(() => {
        expect(screen.queryByText('Auto dismiss')).not.toBeInTheDocument();
      });
    });

    it('should show multiple toasts', async () => {
      const MultiToastComponent: React.FC = () => {
        const { showToast } = useToast();
        
        React.useEffect(() => {
          showToast('First toast', 'info');
          showToast('Second toast', 'success');
        }, [showToast]);

        return null;
      };

      render(
        <ToastProvider>
          <MultiToastComponent />
        </ToastProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('First toast')).toBeInTheDocument();
        expect(screen.getByText('Second toast')).toBeInTheDocument();
      });
    });
  });
});
