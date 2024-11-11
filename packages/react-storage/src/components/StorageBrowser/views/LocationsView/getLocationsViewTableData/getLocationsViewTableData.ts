import { DataTableProps } from '../../../composables/DataTable';
import { LocationData } from '../../../actions';
import { LocationPermissions } from '../../../credentials/types';
import { LocationViewHeaders } from './types';

export const getLocationsViewTableData = ({
  pageItems,
  onNavigate,
  headers,
  getPermissionName,
}: {
  pageItems: LocationData[];
  onNavigate: (location: LocationData) => void;
  headers: LocationViewHeaders;
  getPermissionName: (permissions: LocationPermissions) => string;
}): DataTableProps => {
  const rows: DataTableProps['rows'] = pageItems.map((location) => {
    const { bucket, id, permissions, prefix } = location;
    return {
      key: id,
      content: headers.map(({ key: columnKey }) => {
        const key = `${columnKey}-${id}`;
        switch (columnKey) {
          case 'bucket': {
            return { key, type: 'text', content: { text: bucket } };
          }
          case 'folder': {
            return {
              key,
              type: 'button',
              content: {
                label: prefix || bucket,
                onClick: () => {
                  onNavigate(location);
                },
              },
            };
          }
          case 'permission': {
            return {
              key,
              type: 'text',
              content: { text: getPermissionName(permissions) },
            };
          }
        }
      }),
    };
  });

  return { headers, rows };
};
