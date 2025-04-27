export interface Host {
  id: number
  name: string
  ip: string
  os: string
}

export interface NewHost {
  name: string
  ip: string
  os: string
  ssh_credentials_ids: Array<number>
  winrm_credentials_ids: Array<number>
}

export interface ErrorHosts {
  ip?: Array<string>
  name?: Array<string>
  os?: Array<string>
}