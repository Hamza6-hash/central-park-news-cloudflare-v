import { SquareCheck, AlertCircle } from 'lucide-react';
import React, { useEffect } from 'react';

interface ToastProps {
  show: boolean;
  onClose: () => void;
  title?: string;
  description?: string | null | undefined;
  type?: 'success' | 'error';
}

const CustomToast: React.FC<ToastProps> = ({ 
  show, 
  onClose, 
  title = "Success", 
  description = "Thanks For Subscribing.",
  type = "success"
}) => {
  if (!show) return null;

  // Define styles based on type
  const isError = type === 'error';
  const bgColor = isError ? 'bg-[#FEE2E2]' : 'bg-[#D1FADF]';
  const textColor = isError ? 'text-[#DC2626]' : 'text-[#047857]';
  const hoverColor = isError ? 'hover:text-[#991B1B]' : 'hover:text-[#065F46]';
  
  return (
    <div className="fixed top-4 right-4 md:bottom-6 md:top-auto md:right-6 z-50 w-full max-w-[350px] md:max-w-[300px] px-4 md:px-0">
      <div className={`${bgColor} ${textColor} rounded-lg p-4 flex items-center gap-3 shadow-md w-full animate-in slide-in-from-top md:slide-in-from-right duration-300`}>
        {/* Icon - changes based on type */}
        <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0">
          {isError ? (
            <AlertCircle size={20} strokeWidth={1.5} />
          ) : (
            <SquareCheck size={20} strokeWidth={1.5} />
          )}
        </div>
                        
        {/* Content */}
        <div className="flex-1">
          <div className={`font-semibold ${textColor}`}>{title}</div>
          <div className={`${textColor} text-sm`}>{description}</div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className={`${textColor} ${hoverColor} ml-2 text-lg`}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default CustomToast;