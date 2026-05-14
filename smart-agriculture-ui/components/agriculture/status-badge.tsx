'use client'

interface StatusBadgeProps {
  status: 'GOOD' | 'WARNING' | 'CRITICAL'
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusStyle = () => {
    switch (status) {
      case 'GOOD':
        return 'bg-green-600 text-white'
      case 'WARNING':
        return 'bg-yellow-500 text-gray-900'
      case 'CRITICAL':
        return 'bg-red-600 text-white'
      default:
        return 'bg-card text-foreground'
    }
  }

  return (
    <div className={`inline-block px-6 py-3 rounded-lg font-bold text-lg ${getStatusStyle()}`}>
      {status}
    </div>
  )
}
