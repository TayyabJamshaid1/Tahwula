import React from "react";

interface GroupActionConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmText: string;
  confirmClassName?: string;
  isLoading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const GroupActionConfirmModal = ({
  open,
  title,
  description,
  confirmText,
  confirmClassName = "bg-red-600 hover:bg-red-700",
  isLoading,
  onCancel,
  onConfirm,
}: GroupActionConfirmModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60]">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 w-[320px]">
        <h3 className="font-semibold mb-2 text-white">{title}</h3>

        <p className="text-sm text-gray-400">{description}</p>

        <div className="flex gap-2 mt-4">
          <button
            disabled={isLoading}
            onClick={onCancel}
            className={`flex-1 bg-gray-700 py-2 rounded text-white ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-600"
            }`}
          >
            Cancel
          </button>

          <button
            disabled={isLoading}
            onClick={onConfirm}
            className={`flex-1 py-2 rounded text-white ${confirmClassName} ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupActionConfirmModal;