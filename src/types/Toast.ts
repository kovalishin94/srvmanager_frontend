export interface Toast {
  id: string
  message: string
  type: "success" | "warning" | "danger"
  duration: number
}