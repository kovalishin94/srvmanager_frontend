export interface DataTableAction {
  label: string
  action: (id: string | number) => void
}