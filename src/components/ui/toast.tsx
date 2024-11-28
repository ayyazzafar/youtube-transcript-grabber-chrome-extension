import * as React from 'react';
import { styled, keyframes } from '@stitches/react';
import { Cross2Icon } from '@radix-ui/react-icons';

const slideIn = keyframes({
  from: { transform: 'translateX(100%)' },
  to: { transform: 'translateX(0)' }
});

const slideOut = keyframes({
  from: { transform: 'translateX(0)' },
  to: { transform: 'translateX(100%)' }
});

const ToastRoot = styled('div', {
  position: 'fixed',
  top: '1rem',
  right: '1rem',
  padding: '0.75rem 1rem',
  borderRadius: '0.375rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  zIndex: 9999,
  animation: `${slideIn} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  '&[data-state="closed"]': {
    animation: `${slideOut} 150ms cubic-bezier(0.16, 1, 0.3, 1)`
  },
  variants: {
    variant: {
      default: {
        backgroundColor: 'white',
        color: 'black'
      },
      destructive: {
        backgroundColor: '#fee2e2',
        color: '#dc2626'
      }
    }
  },
  defaultVariants: {
    variant: 'default'
  }
});

const Title = styled('div', {
  fontWeight: 500,
  marginRight: '0.5rem'
});

const Description = styled('div', {
  fontSize: '0.875rem'
});

const CloseButton = styled('button', {
  all: 'unset',
  cursor: 'pointer',
  marginLeft: 'auto',
  padding: '0.25rem',
  '&:hover': {
    opacity: 0.7
  }
});

interface ToastProps {
  open?: boolean;
  variant?: 'default' | 'destructive';
  title?: string;
  description?: string;
  duration?: number;
  onOpenChange?: (open: boolean) => void;
}

export const Toast: React.FC<ToastProps> = ({
  open,
  variant = 'default',
  title,
  description,
  duration = 3000,
  onOpenChange
}) => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onOpenChange?.(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [open, duration, onOpenChange]);

  if (!open && !isVisible) return null;

  return (
    <ToastRoot variant={variant} data-state={isVisible ? 'open' : 'closed'}>
      {title && <Title>{title}</Title>}
      {description && <Description>{description}</Description>}
      <CloseButton onClick={() => setIsVisible(false)}>
        <Cross2Icon />
      </CloseButton>
    </ToastRoot>
  );
}; 