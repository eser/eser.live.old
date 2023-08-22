export interface ResultType<T> {
  payload: T | null;
  error?: {
    message: string;
  };
}
