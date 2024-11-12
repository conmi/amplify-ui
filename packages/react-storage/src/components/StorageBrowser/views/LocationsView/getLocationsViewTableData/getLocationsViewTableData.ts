import { DataTableProps } from '../../../composables/DataTable';
import { LocationData } from '../../../actions';
import { LocationViewHeaders } from './types';

export const getLocationsViewTableData = ({
  pageItems,
  onNavigate,
  onDownload,
  headers,
  downloadLabel,
}: {
  pageItems: LocationData[];
  onNavigate: (location: LocationData) => void;
  headers: LocationViewHeaders;
  onDownload: (location: LocationData) => void;
  downloadLabel: (fileName: string) => string;
}): DataTableProps => {
  const rows: DataTableProps['rows'] = pageItems.map((location) => {
    const { bucket, id, permission, prefix } = location;
    return {
      key: id,
      content: headers.map(({ key: columnKey }) => {
        const key = `${columnKey}-${id}`;
        switch (columnKey) {
          case 'bucket': {
            return { key, type: 'text', content: { text: bucket } };
          }
          case 'folder': {
            return location.type === 'OBJECT'
              ? {
                  key,
                  type: 'text',
                  content: {
                    text: prefix,
                  },
                }
              : {
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
            return { key, type: 'text', content: { text: permission } };
          }
          case 'action': {
            return location.type === 'OBJECT'
              ? {
                  key,
                  type: 'button',
                  content: {
                    icon: 'download',
                    ariaLabel: downloadLabel(location.prefix),
                    onClick: () => {
                      onDownload(location);
                    },
                  },
                }
              : {
                  key,
                  type: 'text',
                  content: { text: '' },
                };
          }
        }
      }),
    };
  });

  return { headers, rows };
};