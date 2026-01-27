import { Toaster as Sonner, type ToasterProps } from 'sonner'

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="dark"
      visibleToasts={3}
      toastOptions={{
        classNames: {
          toast: 'bg-surface border-white/10 text-foreground',
          title: 'text-foreground',
          description: 'text-muted',
          success: 'border-success/30 bg-success/10',
          error: 'border-error/30 bg-error/10',
          info: 'border-primary/30 bg-primary/10',
        },
      }}
      {...props}
    />
  )
}
