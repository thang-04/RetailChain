import React from 'react';
import { AlertTriangle, Info, XCircle, CheckCircle } from 'lucide-react';

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "warning" // warning, danger, info, success
}) => {
    if (!isOpen) return null;

    const variantStyles = {
        warning: {
            icon: AlertTriangle,
            bgColor: "bg-amber-50 dark:bg-amber-900/20",
            iconColor: "text-amber-600 dark:text-amber-400",
            borderColor: "border-amber-200 dark:border-amber-800",
            buttonColor: "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500"
        },
        danger: {
            icon: XCircle,
            bgColor: "bg-red-50 dark:bg-red-900/20",
            iconColor: "text-red-600 dark:text-red-400",
            borderColor: "border-red-200 dark:border-red-800",
            buttonColor: "bg-red-600 hover:bg-red-700 focus:ring-red-500"
        },
        info: {
            icon: Info,
            bgColor: "bg-blue-50 dark:bg-blue-900/20",
            iconColor: "text-blue-600 dark:text-blue-400",
            borderColor: "border-blue-200 dark:border-blue-800",
            buttonColor: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
        },
        success: {
            icon: CheckCircle,
            bgColor: "bg-green-50 dark:bg-green-900/20",
            iconColor: "text-green-600 dark:text-green-400",
            borderColor: "border-green-200 dark:border-green-800",
            buttonColor: "bg-green-600 hover:bg-green-700 focus:ring-green-500"
        }
    };

    const style = variantStyles[variant];
    const Icon = style.icon;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
            <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-card shadow-2xl transition-all">
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 rounded-full p-3 ${style.bgColor} border ${style.borderColor}`}>
                            <Icon className={`w-6 h-6 ${style.iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                {title}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                {message}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-slate-50 dark:bg-[#182124] px-6 py-4 flex gap-3 justify-end border-t border-slate-200 dark:border-slate-700">
                    <button
                        className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-transparent rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        onClick={onClose}
                        type="button"
                    >
                        {cancelText}
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-bold text-white rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${style.buttonColor}`}
                        onClick={onConfirm}
                        type="button"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
