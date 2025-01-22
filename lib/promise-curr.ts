/**
 * 限制promise并发数
 */

interface IPromiseConcurrency {
  limit?: number;
  retry?: number;
  skipError?: boolean;
}
interface IPromiseConcurrencyQueue {
  promiseFn: (...args: any) => any;
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
  retry?: number;
  skipError?: boolean;
}

enum CONCURRENCY_STATUS {
  PENDING = "pending",
  END = "end",
}

export class PromiseConcurrency {
  private _limit: number
  private _retry: number
  private _skipError: boolean
  private requestQueue: IPromiseConcurrencyQueue[]
  private _status: CONCURRENCY_STATUS = CONCURRENCY_STATUS.PENDING

  constructor(opts?: IPromiseConcurrency) {
    this._limit = opts?.limit ?? (Number?.MAX_SAFE_INTEGER || 9999)
    this._retry = opts?.retry ?? 0
    this._skipError = opts?.skipError ?? false
    this.requestQueue = []
  }

  private _activeCount = 0

  get activeCount() {
    return this._activeCount
  }

  get pendingCount() {
    return this.requestQueue.length
  }

  append(
    promiseFn: IPromiseConcurrencyQueue["promiseFn"],
    opts?: Omit<IPromiseConcurrency, "limit">
  ) {
    if (this._status === CONCURRENCY_STATUS.END) this.clear()
    return new Promise((resolve, reject) => {
      const payload: IPromiseConcurrencyQueue = {
        promiseFn,
        resolve,
        reject,
        retry: opts?.retry ?? this._retry,
        skipError: opts?.skipError ?? this._skipError
      }
      this.queue(payload)
    })
  }

  clear() {
    this.requestQueue = []
    this._activeCount = 0
    this._status = CONCURRENCY_STATUS.PENDING
  }

  private async queue(current: IPromiseConcurrencyQueue) {
    const { promiseFn, resolve, reject, skipError } = current
    if (this._activeCount < this._limit) {
      try {
        this._activeCount += 1
        const res = await promiseFn()
        resolve(res)
        this._activeCount -= 1
        this.next()
      } catch (err) {
        if (current.retry) {
          current.retry -= 1
          this._activeCount -= 1
          this.queue({
            promiseFn,
            resolve,
            reject,
            retry: current.retry,
            skipError: current.skipError
          })
        } else {
          if (skipError) {
            resolve(err)
            this._activeCount -= 1
            this.next()
          } else {
            this._status = CONCURRENCY_STATUS.END
            reject(err)
          }
        }
      }
    } else {
      this.requestQueue.push(current)
    }
  }

  private async next() {
    if (
      this._activeCount < this._limit &&
      this.requestQueue?.length &&
      this._status === CONCURRENCY_STATUS.PENDING
    ) {
      const nextRequest = this.requestQueue.shift()!
      this.queue(nextRequest)
    } else if (this._status === CONCURRENCY_STATUS.END) {
      this.clear()
    }
  }
}