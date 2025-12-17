import { useState, useCallback } from 'react'

export type LogType = 'success' | 'error' | 'info' | 'warning'

export interface DashLog {
  id: string
  type: LogType
  message: string
  timestamp: string
}

export function useDashLogs() {
  const [logs, setLogs] = useState<DashLog[]>([
    {
      id: '0',
      type: 'success',
      message: 'Dash ready',
      timestamp: new Date().toLocaleTimeString(),
    },
  ])

  const addLog = useCallback((type: LogType, message: string) => {
    const newLog: DashLog = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date().toLocaleTimeString(),
    }
    setLogs((prev) => [...prev, newLog])
  }, [])

  const clearLogs = useCallback(() => {
    setLogs([
      {
        id: Date.now().toString(),
        type: 'success',
        message: 'Logs cleared',
        timestamp: new Date().toLocaleTimeString(),
      },
      {
        id: (Date.now() + 1).toString(),
        type: 'info',
        message: 'Ready for new tests',
        timestamp: new Date().toLocaleTimeString(),
      },
    ])
  }, [])

  return { logs, addLog, clearLogs }
}
