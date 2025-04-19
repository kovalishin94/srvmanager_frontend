export interface Host {
  id: number
  name: string
  ip: string
  os: string
}

export interface ErrorHosts {
  ip?: Array<string>
  name?: Array<string>
  os?: Array<string>
}