import type { Component } from 'vue'
import DangerButton from './DangerButton.vue'
import MainButton from './MainButton.vue'
import SecondaryButton from './SecondaryButton.vue'
import TransparentButton from './TransparentButton.vue'

export default <Record<string, Component>>{
  DangerButton,
  MainButton,
  SecondaryButton,
  TransparentButton,
}
