import React from 'react';

import { CLASS_BASE } from '../constants';
import { Controls } from '../Controls';
import { resolveClassName } from '../utils';
import { useLocationsView } from './useLocationsView';
import { ControlsContextProvider } from '../../controls/context';
import { DataRefreshControl } from '../../controls/DataRefreshControl';
import { DataTableControl } from '../../controls/DataTableControl';
import { SearchControl } from '../../controls/SearchControl';
import { LocationsViewProps } from './types';
import { ViewElement } from '../../context/elements';
import { getLocationsViewTableData } from './getLocationsViewTableData';
import { useDisplayText } from '../../displayText';
import { LocationViewHeaders } from './getLocationsViewTableData/types';

import { useProcessTasks } from '../../tasks';
import { useGetActionInput } from '../../providers/configuration';
import { FileDataItem, LocationData, downloadHandler } from '../../actions';

export const DEFAULT_ERROR_MESSAGE = 'There was an error loading locations.';

const {
  EmptyMessage,
  Loading: LoadingElement,
  Message,
  Paginate,
  Title,
} = Controls;

const Loading = ({ show }: { show: boolean }) => {
  return show ? <LoadingElement /> : null;
};

const LocationsMessage = ({
  show,
  message,
}: {
  show: boolean;
  message?: string;
}): React.JSX.Element | null => {
  return show ? (
    <Message variant="error">{message ?? DEFAULT_ERROR_MESSAGE}</Message>
  ) : null;
};

const getHeaders = ({
  tableColumnBucketHeader,
  tableColumnFolderHeader,
  tableColumnPermissionsHeader,
  tableColumnActionsHeader,
}: {
  tableColumnBucketHeader: string;
  tableColumnFolderHeader: string;
  tableColumnPermissionsHeader: string;
  tableColumnActionsHeader: string;
}): LocationViewHeaders => {
  return [
    {
      key: 'folder',
      type: 'sort',
      content: { label: tableColumnFolderHeader },
    },
    {
      key: 'bucket',
      type: 'sort',
      content: { label: tableColumnBucketHeader },
    },
    {
      key: 'permission',
      type: 'sort',
      content: { label: tableColumnPermissionsHeader },
    },
    {
      key: 'action',
      type: 'sort',
      content: { label: tableColumnActionsHeader },
    },
  ];
};

const LocationsEmptyMessage = ({ show }: { show: boolean }) => {
  return show ? <EmptyMessage>No locations to show.</EmptyMessage> : null;
};

export function LocationsView({
  className,
  ...props
}: LocationsViewProps): React.JSX.Element {
  const {
    hasError,
    hasNextPage,
    highestPageVisited,
    page,
    isLoading,
    pageItems,
    message,
    shouldShowEmptyMessage,
    onRefresh,
    onPaginate,
    onNavigate,
    onSearch,
  } = useLocationsView(props);

  const {
    LocationsView: {
      title,
      tableColumnBucketHeader,
      tableColumnFolderHeader,
      tableColumnPermissionsHeader,
      tableColumnActionsHeader,
      searchPlaceholder,
    },
  } = useDisplayText();

  const headers = getHeaders({
    tableColumnBucketHeader,
    tableColumnFolderHeader,
    tableColumnPermissionsHeader,
    tableColumnActionsHeader,
  });

  const getConfig = useGetActionInput();

  const [{ tasks }, handleDownload] = useProcessTasks(downloadHandler);

  const onDownload = (location: LocationData) => {
    const data: FileDataItem = {
      fileKey: location.prefix,
      id: location.id,
      key: location.prefix,
      lastModified: new Date(),
      size: 1000,
      type: 'FILE',
    };

    handleDownload({ config: getConfig(location), data });
  };

  return (
    <ControlsContextProvider
      data={{
        isDataRefreshDisabled: isLoading,
        tableData: getLocationsViewTableData({
          headers,
          pageItems: pageItems.map((item) => ({
            ...item,
            isPending: tasks?.some(
              ({ data, status }) => data.id === item.id && status === 'PENDING'
            ),
          })),
          onDownload,
          onNavigate,
        }),
        searchPlaceholder: searchPlaceholder,
      }}
      onSearch={onSearch}
      onRefresh={onRefresh}
    >
      <div
        className={resolveClassName(CLASS_BASE, className)}
        data-testid="LOCATIONS_VIEW"
      >
        <Title>{title}</Title>
        <ViewElement className={`${CLASS_BASE}__location-detail-view-controls`}>
          <SearchControl className={`${CLASS_BASE}__locations-view-search`} />
          <Paginate
            currentPage={page}
            highestPageVisited={highestPageVisited}
            hasMorePages={hasNextPage}
            onPaginate={onPaginate}
          />
          <DataRefreshControl
            className={`${CLASS_BASE}__locations-view-data-refresh`}
          />
        </ViewElement>
        <LocationsMessage show={hasError} message={message} />
        <Loading show={isLoading} />
        {hasError ? null : (
          <ViewElement className={`${CLASS_BASE}__table-wrapper`}>
            <DataTableControl
              className={`${CLASS_BASE}__locations-view-data-table`}
            />
          </ViewElement>
        )}
        <LocationsEmptyMessage show={shouldShowEmptyMessage} />
      </div>
    </ControlsContextProvider>
  );
}
