import { SelectItem } from './interfaces/select-item.interface'

export const enum STORAGE_KEYS {
  DARK_MODE = 'isDarkMode',
  DEFAULT_TEMPLATE = 'default',
  SELECTED_TEMPLATE = 'selectedTemplate',
}

export const DEFAULT_TEMPLATE_ITEM: SelectItem = {
  value: 'default',
  label: 'Default',
}

export const MAPS_URL: string = 'https://www.google.com/maps/place/'

export const DELETE_TEMPLATE_MESSAGE: string =
  'Are you sure you want to delete this template? This action can not be undone.'

export const TEMPLATE_NAME_TAKEN_MESSAGE: string =
  'Template with this name already exists.'

export const SMS_MESSAGE_HEADER: string =
  'Emergency message sent from the "I GOT YOU" application!'
