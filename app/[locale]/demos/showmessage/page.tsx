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

      <h1 className="mb-6 text-2xl font-bold">Message Component Demo</h1>

      <div className="space-y-4">
        {messageTypes.map(({ type, label, content }) => (
          <div key={type} className="space-y-2">
            <h2 className="text-lg font-semibold">{label}</h2>
            <div className="space-x-4">
              <button
                onClick={() => showMessage(content, type)}
                className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
              >
                Show for 3s
              </button>
              <button
                onClick={() => showMessage(content, type, { duration: 5000 })}
                className="rounded-lg bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
              >
                Show for 5s
              </button>
              <button
                onClick={() => showMessage(content, type, {
                  duration: 2000,
                  afterDuration: () => console.log(`${type} message closed`)
                })}
                className="rounded-lg bg-purple-500 px-4 py-2 text-white transition-colors hover:bg-purple-600"
              >
                2s + Callback
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-lg bg-gray-100 p-4">
        <h2 className="mb-2 text-lg font-semibold">Custom Content</h2>
        <button
          onClick={() => showMessage(
            <div className="flex items-center space-x-2">
              <span>🎉</span>
              <span>Custom content with emoji!</span>
            </div>,
            "default"
          )}
          className="rounded-lg bg-orange-500 px-4 py-2 text-white transition-colors hover:bg-orange-600"
        >
          Show Custom Content
        </button>
      </div>
    </div>
  )
}