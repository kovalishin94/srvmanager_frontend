export interface ToastType {
  id: number
  message: string
  type: "success" | "warning" | "danger"
  duration: number
}