import { Bell, CheckCircle, XCircle, Info, Loader } from 'lucide-react'
import { toast } from 'sonner'

export function ToastTestCard() {
  const handleSuccess = () => {
    toast.success('Operation completed', {
      description: 'Your changes have been saved successfully.',
    })
  }

  const handleError = () => {
    toast.error('Something went wrong', {
      description: 'Please try again or contact support.',
    })
  }

  const handleInfo = () => {
    toast.info('Heads up!', {
      description: 'This is an informational message.',
    })
  }

  const handlePromise = () => {
    const promise = new Promise<{ message: string }>((resolve) => {
      setTimeout(() => resolve({ message: 'Data loaded' }), 2000)
    })

    toast.promise(promise, {
      loading: 'Loading data...',
      success: (data) => data.message,
      error: 'Failed to load data',
    })
  }

  return (
    <div className="glass rounded-xl p-6 hover:border-primary/30 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary/20 transition-all">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Toast Notifications</h3>
            <p className="text-xs text-muted">Test sonner toasts</p>
          </div>
        </div>
        <span className="px-2 py-1 text-xs font-mono bg-success/10 text-success border border-success/20 rounded">
          UI
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleSuccess}
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-success/10 border border-success/30 text-success hover:bg-success/20 transition-all"
        >
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Success</span>
        </button>

        <button
          type="button"
          onClick={handleError}
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-error/10 border border-error/30 text-error hover:bg-error/20 transition-all"
        >
          <XCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Error</span>
        </button>

        <button
          type="button"
          onClick={handleInfo}
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all"
        >
          <Info className="w-4 h-4" />
          <span className="text-sm font-medium">Info</span>
        </button>

        <button
          type="button"
          onClick={handlePromise}
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-warning/10 border border-warning/30 text-warning hover:bg-warning/20 transition-all"
        >
          <Loader className="w-4 h-4" />
          <span className="text-sm font-medium">Promise</span>
        </button>
      </div>
    </div>
  )
}
