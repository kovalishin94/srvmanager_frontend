export interface BaseOperation {
  id: string
  created_by: {first_name: string, last_name: string}
  log: Record<string, string>
  status: 'queue' | 'progress' | 'error' | 'completed'
  created_at: string
  updated_at: string
}

export interface ExecuteCommand extends BaseOperation {
  hosts: Array<{id: number, name: string, ip: string}>
  command: Array<string>
  protocol: 'ssh' | 'winrm'
  sudo: boolean
  stdout: Record<string, string>
  stderr: Record<string, string>
}

export interface ExecuteCommandNew {
  hosts: Array<number>
  command: Array<string>
  protocol: 'ssh' | 'winrm'
  sudo: boolean
}

export interface SendFile extends BaseOperation {
  hosts: Array<{id: number, name: string, ip: string}>
  protocol: 'sftp' | 'smb'
  local_path: string
  target_path: string
  file: File | null
}

export interface SendFileNew{
  hosts: Array<number>
  protocol: 'sftp' | 'smb'
  local_path: string
  target_path: string
  file: File | null
}

export interface SendFileErrors {
  local_path?: Array<string>
  target_path?: Array<string>
  file?: Array<string>
}