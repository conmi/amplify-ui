import React from 'react';
import {
  EmptyMessageControl,
  LoadingControl,
  MessageControl,
} from '../Controls';
import { ViewElement } from '../../context/elements';
import { displayText } from '../../displayText/en';
import { useDestinationPicker } from './CopyView/useDestinationPicker';
import { CLASS_BASE } from '../constants';
import { DataTableControl } from '../../controls/DataTableControl';
import { ControlsContextProvider } from '../../controls/context';
import {
  getDestinationListFullPrefix,
  getDestinationPickerTableData,
} from './utils/getDestinationPickerDataTable';
import { ControlsContext } from '../../controls/types';
import { Breadcrumb } from '../../components/BreadcrumbNavigation';
import { DescriptionList } from '../../components/DescriptionList';
import { SearchControl } from '../../controls/SearchControl';
import { PaginationControl } from '../../controls/PaginationControl';
const {
  actionSetDestination,
  actionDestinationPickerCurrentFolderSelected,
  actionDestinationPickerNoMoreFolders,
  actionDestinationPickerDefaultError,
} = displayText;

const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_LIST_OPTIONS = {
  pageSize: DEFAULT_PAGE_SIZE,
  delimiter: '/',
};

export const DestinationPicker = ({
  destinationList,
  onDestinationChange,
}: {
  destinationList: string[];
  onDestinationChange: (destination: string[]) => void;
}): React.JSX.Element => {
  const {
    bucket,
    items,
    highestPageVisited,
    hasNextToken,
    currentPage,
    isLoading,
    hasError,
    onPaginate,
    onSearch,
    pageItems,
  } = useDestinationPicker({ destinationList });

  const handleNavigateFolder = (key: string) => {
    const newPath = [...destinationList, key.replace('/', '')];
    onDestinationChange(newPath);
  };

  const handleNavigatePath = (index: number) => {
    const newPath = destinationList.slice(0, index + 1);
    onDestinationChange(newPath);
  };

  const tableData = getDestinationPickerTableData({
    items: pageItems,
    handleNavigateFolder,
  });

  const contextValue: ControlsContext = {
    data: {
      tableData,
      paginationData: {
        page: currentPage,
        highestPageVisited,
        hasMorePages: hasNextToken,
        onPaginate,
      },
      showIncludeSubfolders: false,
      searchPlaceholder: displayText.filterCopyPlaceholder,
    },
    onSearch,
  };

  const noSubfolders = !items.length;
  const messageVariant = noSubfolders ? 'info' : 'error';
  const message = noSubfolders
    ? `${actionDestinationPickerCurrentFolderSelected} ${getDestinationListFullPrefix(
        destinationList
      )}. ${actionDestinationPickerNoMoreFolders}`
    : actionDestinationPickerDefaultError;
  const showMessage = !isLoading && (noSubfolders || hasError);

  return (
    <ControlsContextProvider {...contextValue}>
      <DescriptionList
        descriptions={[
          {
            term: `${actionSetDestination}:`,
            details: destinationList.length ? (
              <>
                {destinationList.map((key, index) => (
                  <Breadcrumb
                    isCurrent={index === destinationList.length - 1}
                    key={`${key}-${index}`}
                    onNavigate={() => handleNavigatePath(index)}
                    // If bucket level access, show bucket name as root breadcrumb
                    name={key === '' ? bucket : key.replace('/', '')}
                  />
                ))}
              </>
            ) : (
              '-'
            ),
          },
        ]}
      />
      <ViewElement className={`${CLASS_BASE}__action-destination`}>
        <SearchControl />
        <PaginationControl className={`${CLASS_BASE}__paginate`} />
      </ViewElement>
      <ViewElement className="storage-browser__table-wrapper">
        <DataTableControl className={`${CLASS_BASE}__table`} />
        {noSubfolders && <EmptyMessageControl>{message}</EmptyMessageControl>}
        {showMessage && !noSubfolders && (
          <MessageControl variant={messageVariant}>{message}</MessageControl>
        )}
        {isLoading && <LoadingControl />}
      </ViewElement>
    </ControlsContextProvider>
  );
};
