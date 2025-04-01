import { useCommonLoadingContext } from "@/components/common/loading-mask"

type LoadingHandlerOptions = {
  onError?: (error: unknown) => void;
  onSuccess?: (result: unknown) => void;
};

export const useLoadingHandler = (options: LoadingHandlerOptions = {}) => {
  const { isLoading,setIsLoading } = useCommonLoadingContext()
  const withLoading = async <T>(
    asyncFn: () => Promise<T>
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
