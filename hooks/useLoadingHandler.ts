import { useState } from "react"

type LoadingHandlerOptions = {
  onError?: (error: any) => void;
  onSuccess?: (result: any) => void;
};

export const useLoadingHandler = (options: LoadingHandlerOptions = {}) => {
  const [isLoading, setIsLoading] = useState(false)

  const withLoading = async <T>(
    asyncFn: () => Promise<T>,
  ): Promise<T | undefined> => {
    setIsLoading(true)
    try {
      const result = await asyncFn()
      options.onSuccess?.(result)
      return result
    } catch (error) {
      options.onError?.(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    withLoading
  }
}
