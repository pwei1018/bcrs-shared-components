import { ActionChip } from './index'
import { ActionableItemIF } from '@/interfaces'
import { ActionTypes } from '@/enums'
import Vuetify from 'vuetify'

export default {
  title: 'component/ActionChip',
  component: ActionChip,
  argTypes: {
  }
}

const Template = (args, { argTypes }) => ({
  vuetify: new Vuetify({ iconfont: 'mdi' }),
  props: Object.keys(argTypes),
  components: { ActionChip },
  template: '<action-chip v-bind="$props" />' // $props comes from args below
})

const addedAction: ActionableItemIF = {
  action: ActionTypes.ADDED
}

const removedAction: ActionableItemIF = {
  action: ActionTypes.REMOVED
}

const editedAction: ActionableItemIF = {
  action: ActionTypes.EDITED
}

export const added = Template.bind({})
added.args = {
  actionableItem: addedAction,
  isCorrection: true
}

export const removed = Template.bind({})
removed.args = {
  actionableItem: removedAction,
  isCorrection: true
}

export const edited = Template.bind({})
edited.args = {
  actionableItem: editedAction,
  isCorrection: true
}
