import React from 'react';

import { ControlsContextProvider } from '../../../controls/context';
import { useDisplayText } from '../../../displayText';

import { getActionViewTableData } from '../getActionViewTableData';

import { DestinationProvider } from './DestinationControl';
import { FoldersPaginateProvider } from './FoldersPaginateControl';
import { FoldersTableProvider } from './FoldersTableControl';

import { useFolders } from './useFolders';
import { CopyViewProviderProps } from './types';

export function CopyViewProvider({
  children,
  ...props
}: CopyViewProviderProps): React.JSX.Element {
  const {
    actionCancelLabel,
    actionDestinationLabel,
    actionExitLabel,
    actionStartLabel,
    overwriteWarningMessage,
  } = useDisplayText()['CopyView'];

  const {
    destinationList,
    isProcessing,
    isProcessingComplete,
    location,
    onActionCancel,
    onActionExit,
    onActionStart,
    onDestinationChange,
    onTaskCancel,
    statusCounts,
    tasks,
  } = props;

  const { folders, hasError, message, onSearch, onSelect, ...paginateProps } =
    useFolders({ destinationList, onDestinationChange });

  const { current, key: locationKey } = location ?? {};
  const { bucket } = current ?? {};

  const tableData = getActionViewTableData({
    tasks,
    locationKey,
    isProcessing,
    onTaskCancel,
  });

  const isActionStartDisabled =
    isProcessing || isProcessingComplete || destinationList.length === 0;

  const isActionCancelDisabled = !isProcessing || isProcessingComplete;

  const messageContent = hasError
    ? message
    : isProcessing || isProcessingComplete
    ? undefined
    : overwriteWarningMessage;

  const messageType = hasError ? 'error' : undefined;

  return (
    <ControlsContextProvider
      data={{
        actionCancelLabel,
        actionExitLabel,
        actionStartLabel,
        isActionCancelDisabled,
        isActionExitDisabled: isProcessing,
        isActionStartDisabled,
        messageContent,
        messageType,
        statusCounts,
        tableData,
      }}
      onActionStart={onActionStart}
      onActionExit={onActionExit}
      onActionCancel={onActionCancel}
      onSearch={onSearch}
    >
      <DestinationProvider
        bucket={bucket}
        label={actionDestinationLabel}
        destinationList={destinationList}
        onDestinationChange={onDestinationChange}
      >
        <FoldersPaginateProvider {...paginateProps}>
          <FoldersTableProvider folders={folders} onSelect={onSelect}>
            {children}
          </FoldersTableProvider>
        </FoldersPaginateProvider>
      </DestinationProvider>
    </ControlsContextProvider>
  );
}
