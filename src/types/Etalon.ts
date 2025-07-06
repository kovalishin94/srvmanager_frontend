import type { BaseOperation } from '@/types/Ops.ts'

export interface EtalonInstance {
  id: number
  url: string
  path_to_instance: string
  host: number | null
  version: string
  tag: string
  stand: string
  is_valid: boolean
  docker_command: 'docker-compose' | 'docker compose'
  created_by: {first_name: string, last_name: string}
  created_at: string
  updated_at: string
}

export type NewEtalonInstance = Pick<EtalonInstance, 'path_to_instance' | 'host' | 'docker_command'>

export interface EtalonInstanceErrors {
  path_to_instance?: Array<string>
  host?: Array<string>
  docker_command?: Array<string>
}

export interface UpdateFile {
  id: number
  file: File | null
  version: string
  tag: string
  loaded_by: {first_name: string, last_name: string}
  created_at: string
}

export type UpdateFileNew = Pick<UpdateFile, 'file'>

export interface UpdateFileErrors {
  file?: Array<string>
}

export interface EtalonUpdate extends BaseOperation {
  instances: Array<Pick<EtalonInstance, 'id' | 'url' | 'version' | 'tag' | 'stand' >>
  update_file: Pick<UpdateFile, 'id' | 'version' | 'tag'>
}

export interface EtalonUpdateNew {
  instances: Array<number>
  update_file: number | null
}

export interface EtalonUpdateErrors {
  instances?: Array<string>
  update_file?: Array<string>
}