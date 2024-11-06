import React from 'react';

import { CLASS_BASE } from '../constants';
import { Controls } from '../Controls';
import { resolveClassName } from '../utils';
import { useLocationsView } from './useLocationsView';
import { ControlsContextProvider } from '../../controls/context';
import { DataRefreshControl } from '../../controls/DataRefreshControl';
import { DataTableControl } from '../../controls/DataTableControl';
import { SearchControl } from '../../controls/SearchControl';
<<<<<<< HEAD
=======
import { TitleControl } from '../../controls/TitleControl';

>>>>>>> 67a2fd751 (Update integ and test)
import { LocationsViewProps } from './types';
import { ViewElement } from '../../context/elements';
import { getLocationsViewTableData } from './getLocationsViewTableData';

export const DEFAULT_ERROR_MESSAGE = 'There was an error loading locations.';

const { EmptyMessage, Loading: LoadingElement, Message, Paginate } = Controls;

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

const LocationsEmptyMessage = ({ show }: { show: boolean }) => {
  return show ? <EmptyMessage>No locations to show.</EmptyMessage> : null;
};

export function LocationsView({
  className,
  ...props
}: LocationsViewProps): React.JSX.Element {
  const {
    pageItems,
    hasError,
    message,
    isPaginatePreviousDisabled,
    isPaginateNextDisabled,
    page,
    isLoading,
    searchPlaceholder,
    shouldShowEmptyMessage,
    onRefresh,
    onPaginateNext,
    onPaginatePrevious,
    onNavigate,
    onSearch,
  } = useLocationsView(props);

<<<<<<< HEAD
=======
  // FIXME: Eventually comes from useView hook
  const shouldShowEmptyMessage =
    pageItems.length === 0 && !isLoading && !hasError;
  const contextValue: ControlsContext = {
    data: {
      isDataRefreshDisabled: isLoading,
      searchPlaceholder,
      title: 'Home',
    },
    onSearch,
    onRefresh,
  };

>>>>>>> 2d1d74794 (Fix Errors)
  return (
    <ControlsContextProvider
      data={{
        isDataRefreshDisabled: isLoading,
        tableData: getLocationsViewTableData({ pageItems, onNavigate }),
        searchPlaceholder,
      }}
      onSearch={onSearch}
      onRefresh={onRefresh}
    >
      <div
        className={resolveClassName(CLASS_BASE, className)}
        data-testid="LOCATIONS_VIEW"
      >
        <TitleControl className={`${CLASS_BASE}__location-detail-view-title`} />
        <ViewElement className={`${CLASS_BASE}__location-detail-view-controls`}>
          <SearchControl className={`${CLASS_BASE}__locations-view-search`} />
          <Paginate
            currentPage={page}
            disableNext={isPaginateNextDisabled}
            disablePrevious={isPaginatePreviousDisabled}
            handleNext={onPaginateNext}
            handlePrevious={onPaginatePrevious}
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
