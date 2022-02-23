import { SelectItem } from './interfaces/select-item.interface'

export const enum STORAGE_KEYS {
  DARK_MODE = 'isDarkMode',
  DEFAULT_TEMPLATE = 'default',
  SELECTED_TEMPLATE = 'selectedTemplate',
  TEMPLATE_PREFIX = 'template-',
}

export const enum SMS_SHORTCUT {
  NAME = 'sendMessageShortcut',
  SHORT_LABEL = 'Send',
  LONG_LABEL = 'Send Message',
}

export const DEFAULT_TEMPLATE_ITEM: SelectItem = {
  value: 'default',
  label: 'Default',
}

export const MAPS_URL: string = 'https://www.google.com/maps/place/'

export const enum TEXT {
  DELETE_TEMPLATE = 'Are you sure you want to delete this template?',
  TEMPLATE_NAME_TAKEN = 'Template with this name already exists.',
  SMS_HEADER = 'Emergency message sent from the "I GOT YOU" application!',
  SMS_SEND_SUCCESS = 'Text message sent successfully.',
  SMS_SEND_FAIL = 'Sending text message failed! Please try again.',
  TEMPLATE_MISSING = 'Stored template was not found.',
  LOCATION_PERMISSIONS_MISSING = 'Permission to use location not granted.',
  SMS_PERMISSIONS_MISSING = 'Permission to send SMS not granted.',
}
