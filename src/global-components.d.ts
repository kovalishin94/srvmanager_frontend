import { DefineComponent } from 'vue'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    AttentionIcon: DefineComponent<{}, {}, any>
    CloseIcon:     DefineComponent<{}, {}, any>
    DownArrowIcon: DefineComponent<{}, {}, any>
    ExitIcon:      DefineComponent<{}, {}, any>
    FingerprintIcon: DefineComponent<{}, {}, any>
    HostIcon:      DefineComponent<{}, {}, any>
    LinuxIcon:     DefineComponent<{}, {}, any>
    MenuIcon:      DefineComponent<{}, {}, any>
    OperationsIcon: DefineComponent<{}, {}, any>
    SearchIcon:    DefineComponent<{}, {}, any>
    ThemeIcon:     DefineComponent<{}, {}, any>
    ToastIcons:    DefineComponent<{}, {}, any>
    WindowsIcon:   DefineComponent<{}, {}, any>
    SecretIcon:   DefineComponent<{}, {}, any>
    DangerButton:  DefineComponent<{}, {}, any>
    MainButton:    DefineComponent<{}, {}, any>
    SecondaryButton: DefineComponent<{}, {}, any>
    TransparentButton: DefineComponent<{}, {}, any>
  }
}
