import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div className="mb-8 p-6 bg-gray-800 rounded-lg">
      <p className="text-2xl mb-4">Count: {count}</p>
      <div className="flex gap-4 justify-center">
        <button
          type="button"
          className="px-6 py-2 bg-[#61dafb] text-gray-900 font-semibold rounded hover:bg-[#4db8d4] transition-colors"
          onClick={() => setCount(count + 1)}
        >
          Increment
        </button>
        <button
          type="button"
          className="px-6 py-2 bg-gray-600 text-white font-semibold rounded hover:bg-gray-700 transition-colors"
          onClick={() => setCount(0)}
        >
          Reset
        </button>
        <button
          type="button"
          className="px-6 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition-colors"
          onClick={() => setCount(count - 1)}
        >
          Decrement
        </button>
      </div>
    </div>
  )
}
