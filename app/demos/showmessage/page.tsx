"use client"

import useCommonMessage from "@/components/common/common-message"

export default function MessageDemo() {
  const { showMessage, renderNode } = useCommonMessage()

  const messageTypes = [
    {
      type: "default",
      label: "Default Message",
      content: "This is a default message"
    },
    {
      type: "success",
      label: "Success Message",
      content: "Operation successful!"
    },
    {
      type: "love",
      label: "Love Message",
      content: "Liked!"
    }
  ]

  return (
    <div className="min-h-screen p-8">
      {renderNode}

      <h1 className="text-2xl font-bold mb-6">Message Component Demo</h1>

      <div className="space-y-4">
        {messageTypes.map(({ type, label, content }) => (
          <div key={type} className="space-y-2">
            <h2 className="text-lg font-semibold">{label}</h2>
            <div className="space-x-4">
              <button
                onClick={() => showMessage(content, type)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Show for 3s
              </button>
              <button
                onClick={() => showMessage(content, type, { duration: 5000 })}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Show for 5s
              </button>
              <button
                onClick={() => showMessage(content, type, {
                  duration: 2000,
                  afterDuration: () => console.log(`${type} message closed`)
                })}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                2s + Callback
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Custom Content</h2>
        <button
          onClick={() => showMessage(
            <div className="flex items-center space-x-2">
              <span>🎉</span>
              <span>Custom content with emoji!</span>
            </div>,
            "default"
          )}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Show Custom Content
        </button>
      </div>
    </div>
  )
}