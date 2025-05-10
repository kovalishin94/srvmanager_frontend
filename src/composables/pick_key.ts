export function usePickKey<T, K extends keyof T>(obj: T, keys: readonly K[]): Pick<T, K> {
  const res = {} as Pick<T, K>
  keys.forEach((k) => {
    res[k] = obj[k]
  })
  return res
}
