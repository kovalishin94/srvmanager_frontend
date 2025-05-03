export interface Host {
  id: number
  name: string
  ip: string
  os: string
  ssh_credentials: Array<number>
  winrm_credentials: Array<number>
}

export interface NewHost {
  name: string
  ip: string
  os: string
  ssh_credentials: Array<number>
  winrm_credentials: Array<number>
}

export interface ErrorHosts {
  ip?: Array<string>
  name?: Array<string>
  os?: Array<string>
  ssh_credentials?: Array<string>
  winrm_credentials?: Array<string>
}