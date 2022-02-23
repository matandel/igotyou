import { SelectItem } from './interfaces/select-item.interface'

export const enum STORAGE_KEYS {
  DARK_MODE = 'isDarkMode',
  DEFAULT_TEMPLATE = 'default',
  SELECTED_TEMPLATE = 'selectedTemplate',
  TEMPLATE_PREFIX = 'template-',
}

export const enum SMS_SHORTCUT {
  NAME = 'sendMessageShortcut',
  SHORT_LABEL = 'Send Message',
  LONG_LABEL = 'Send Stored Message',
}

export const DEFAULT_TEMPLATE_ITEM: SelectItem = {
  value: 'default',
  label: 'Default',
}

export const MAPS_URL: string = 'https://www.google.com/maps/place/'

export const DELETE_TEMPLATE_MESSAGE: string =
  'Are you sure you want to delete this template?'

export const TEMPLATE_NAME_TAKEN_MESSAGE: string =
  'Template with this name already exists.'

export const SMS_MESSAGE_HEADER: string =
  'Emergency message sent from the "I GOT YOU" application!'

export const SMS_SUCCESS_MESSAGE: string =
  'Text message sent successfully.'

export const SMS_FAIL_MESSAGE: string =
  'Sending text message failed! Please try again.'

export const TEMPLATE_MISSING_MESSAGE: string =
  'Stored template was not found.'

export const LOCATION_PERMISSIONS_MISSING: string =
  'Permission to use location not granted.'

export const SMS_PERMISSIONS_MISSING: string =
  'Permission to send SMS not granted.'
