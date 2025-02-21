import React from "react"

export function ListError() {
  return (
    <div className="text-center mt-4 text-pink">
      Failed to load data. Please try again.
    </div>
  )
}

export function ListLoading() {
  return (
    <div className="text-center mt-4">
      <button className="btn btn-primary loading">Loading...</button>
    </div>
  )
}

export function ListEnd() {
  return (
    <div className="text-center mt-4">
      <p className="text-gray-500">You have reached the end.</p>
    </div>
  )
}
