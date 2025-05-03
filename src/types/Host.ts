export interface Host {
  id: number
  name: string
  ip: string
  os: string
  ssh_credentials: Array<number | string>
  winrm_credentials: Array<number | string>
}

export interface NewHost {
  name: string
  ip: string
  os: string
  ssh_credentials: Array<number | string>
  winrm_credentials: Array<number | string>
}

export interface ErrorHosts {
  ip?: Array<string>
  name?: Array<string>
  os?: Array<string>
  ssh_credentials?: Array<string>
  winrm_credentials?: Array<string>
}