export interface Toast {
  id: number
  message: string
  type: "success" | "warning" | "danger"
  duration: number
}