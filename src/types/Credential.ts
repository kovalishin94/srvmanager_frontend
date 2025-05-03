export interface Credential {
  id: number
  username: string
  host: Array<number>
}

export interface NewCredential {
  username: string
  password: string
}

export interface SSHCredential extends Credential {
  port: number
}

export interface WinRMCredential extends Credential {
  port: number
  ssl: boolean
}

export interface NewSSHCredential extends NewCredential {
  port: number
  ssh_key: File | null
  passphrase: string
}

export interface NewWinRMCredential extends NewCredential {
  port: number
  ssl: boolean
}

export interface ErrorCredentials {
  username?: Array<string>
  password?: Array<string>
}

export interface ErrorSSHCredentials extends ErrorCredentials {
  port?: Array<string>
  ssh_key?: Array<string>
  passphrase?: Array<string>
}

export interface ErrorWinRMCredentials extends ErrorCredentials {
  port?: Array<string>
  ssl?: Array<string>
}