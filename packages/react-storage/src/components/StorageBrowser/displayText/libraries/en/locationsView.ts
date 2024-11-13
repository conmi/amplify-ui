import { DEFAULT_LIST_VIEW_DISPLAY_TEXT } from './shared';
import { DefaultLocationsViewDisplayText } from '../../types';
import { Permission } from '../../../storage-internal';

const PERMISSION_DISPLAY_TEXT: Record<Permission, string> = {
  READ: 'Read',
  WRITE: 'Write',
  READWRITE: 'Read/Write',
};

export const DEFAULT_LOCATIONS_VIEW_DISPLAY_TEXT: DefaultLocationsViewDisplayText =
  {
    ...DEFAULT_LIST_VIEW_DISPLAY_TEXT,
    title: 'Home',
    searchPlaceholder: 'Filter folders and files',
    getListResultsMessage: () => 'lol',
    getPermissionsValue: (permission: Permission) =>
      PERMISSION_DISPLAY_TEXT[permission] ?? permission,
    tableColumnBucketHeader: 'Bucket',
    tableColumnFolderHeader: 'Folder',
    tableColumnPermissionsHeader: 'Permissions',
  };
