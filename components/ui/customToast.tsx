import { SquareCheck } from 'lucide-react';
import React, { useEffect } from 'react';

interface ToastProps {
  show: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}


const CustomToast: React.FC<ToastProps> = ({ 
  show, 
  onClose, 
  title = "Success", 
  description = "Thanks For Subscribing." 
}) => {
  if (!show) return null;

  return (
    <div className="fixed top-4 right-4 md:bottom-6 md:top-auto md:right-6 z-50 w-full max-w-[350px] md:max-w-[300px] px-4 md:px-0">
      <div className="bg-[#D1FADF] text-[#047857] rounded-lg p-4 flex items-center gap-3 shadow-md w-full animate-in slide-in-from-top md:slide-in-from-right duration-300">
        {/* Checkmark icon - perfectly centered */}
        <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0">
          <SquareCheck className="w-5 h-5" />
        </div>
                
        {/* Content */}
        <div className="flex-1">
          <div className="font-semibold text-[#047857]">{title}</div>
          <div className="text-[#047857] text-sm">{description}</div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="text-[#047857] hover:text-[#065F46] ml-2 text-lg"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default CustomToast;