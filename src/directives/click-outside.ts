import { type Directive } from 'vue'

type ClickOutsideFn = (event: MouseEvent) => void

interface ElWithClickOutside extends HTMLElement {
  __clickOutsideHandler__?: (event: MouseEvent) => void
}

const clickOutside: Directive<ElWithClickOutside, ClickOutsideFn> = {
  beforeMount(el, binding) {
    const handler = (event: MouseEvent) => {
      if (!el.contains(event.target as Node)) {
        binding.value(event)
      }
    }
    el.__clickOutsideHandler__ = handler
    document.addEventListener('click', handler)
  },
  unmounted(el) {
    document.removeEventListener('click', el.__clickOutsideHandler__!)
    delete el.__clickOutsideHandler__
  }
}

export default clickOutside
