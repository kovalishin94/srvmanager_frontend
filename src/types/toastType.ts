export interface ToastType {
  id: string
  message: string
  type: "success" | "warning" | "danger"
  duration: number
}