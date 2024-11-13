import React from 'react';

import { ViewElement } from '../../../context/elements';

import { Title } from '../Controls/Title';
import { CLASS_BASE } from '../../constants';

import { DataTableControl } from '../../../controls/DataTableControl';
import { ActionExitControl } from '../../../controls/ActionExitControl';

import { ActionStartControl } from '../../../controls/ActionStartControl';
import { LoadingIndicatorControl } from '../../../controls/LoadingIndicatorControl';
import { StatusDisplayControl } from '../../../controls/StatusDisplayControl';
import { ActionCancelControl } from '../../../controls/ActionCancelControl';
import { MessageControl } from '../../../controls/MessageControl';
import { SearchControl } from '../../../controls/SearchControl';
import { TitleControl } from '../../../controls/TitleControl';

import { resolveClassName } from '../../utils';

import { useCopyView } from './useCopyView';
import { CopyViewProps } from './types';

import { CopyViewProvider } from './CopyViewProvider';
import { DestinationControl } from './DestinationControl';
import { FoldersPaginateControl } from './FoldersPaginateControl';
import { FoldersTableControl } from './FoldersTableControl';

export function CopyView({
  className,
  ...props
}: CopyViewProps): React.JSX.Element {
  const state = useCopyView(props);
  const { isProcessing, isProcessingComplete } = state;

  return (
    <div className={resolveClassName(CLASS_BASE, className)}>
      <CopyViewProvider {...state}>
        <ActionExitControl />
        <Title />
        <ViewElement className={`${CLASS_BASE}__table-wrapper`}>
          <DataTableControl className={`${CLASS_BASE}__copy-view-data-table`} />
        </ViewElement>
        <ViewElement className={`${CLASS_BASE}__action-destination`}>
          {isProcessing || isProcessingComplete ? null : (
            <>
              <SearchControl />
              <FoldersPaginateControl />
            </>
          )}
          <DestinationControl />
        </ViewElement>
        <ViewElement className="storage-browser__table-wrapper">
          <LoadingIndicatorControl />
          <FoldersTableControl />
        </ViewElement>
        <DestinationControl />
        <ViewElement className={`${CLASS_BASE}__action-footer`}>
          <MessageControl />
          <StatusDisplayControl
            className={`${CLASS_BASE}__action-status-display`}
          />
          <ActionCancelControl className={`${CLASS_BASE}__cancel`} />
          <ActionStartControl
            className={`${CLASS_BASE}__upload-action-start`}
          />
        </ViewElement>
      </CopyViewProvider>
    </div>
  );
}

CopyView.displayName = 'CopyView';

CopyView.Provider = CopyViewProvider;
CopyView.Cancel = ActionCancelControl;
CopyView.Destination = DestinationControl;
CopyView.Exit = ActionExitControl;
CopyView.Folders = FoldersTableControl;
CopyView.FoldersPaginate = FoldersPaginateControl;
CopyView.FoldersSearch = SearchControl;
CopyView.Message = MessageControl;
CopyView.Start = ActionStartControl;
CopyView.Statuses = StatusDisplayControl;
CopyView.Tasks = DataTableControl;
CopyView.Title = TitleControl;
