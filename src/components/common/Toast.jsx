import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { CheckCircle, XCircle, X } from 'lucide-react';
import { removeToast } from '../../store/slices/uiSlice';
import { useToasts } from '../../hooks/useAppHooks';

function Toast({ toast }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const t = setTimeout(() => dispatch(removeToast(toast.id)), 3500);
    return () => clearTimeout(t);
  }, [toast.id, dispatch]);

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-sm font-medium
      animate-slide-in-right pointer-events-auto
      ${toast.type === 'success'
        ? 'bg-surface-850 border-green-500/20 text-white'
        : 'bg-surface-850 border-red-500/20 text-white'
      }`}
    >
      {toast.type === 'success'
        ? <CheckCircle size={15} className="text-green-400 flex-shrink-0" />
        : <XCircle    size={15} className="text-red-400   flex-shrink-0" />
      }
      <span>{toast.message}</span>
      <button onClick={() => dispatch(removeToast(toast.id))}
        className="ml-2 text-white/30 hover:text-white transition-colors">
        <X size={13} />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const toasts = useToasts();
  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => <Toast key={t.id} toast={t} />)}
    </div>
  );
}
