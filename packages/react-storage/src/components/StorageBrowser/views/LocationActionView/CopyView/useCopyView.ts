import { useCallback, useState } from 'react';

import { isFunction } from '@aws-amplify/ui';

import { copyHandler } from '../../../actions/handlers';
import { Task, useProcessTasks } from '../../../tasks';
import { useGetActionInput } from '../../../providers/configuration';
import { useStore } from '../../../providers/store';
import { getDestinationListFullPrefix } from './getDestinationListFullPrefix';
import { CopyViewState, UseCopyViewOptions } from './types';

const getInitialDestinationList = (key: string, prefix?: string) =>
  // handle root bucket access grant
  key === ''
    ? ['']
    : // handle subfolder inside root access grant
    key && prefix == ''
    ? ['', ...key.split('/').slice(0, -1)]
    : // regular access that starts at prefix (not root bucket)
    key.includes('/')
    ? key.split('/').slice(0, -1)
    : [];

export const useCopyView = (options?: UseCopyViewOptions): CopyViewState => {
  const { onExit: _onExit } = options ?? {};
  const [
    {
      location,
      locationItems: { fileDataItems },
    },
    dispatchStoreAction,
  ] = useStore();
  const { key, current } = location;

  const getInput = useGetActionInput();

  const [processState, handleProcess] = useProcessTasks(
    copyHandler,
    fileDataItems,
    { concurrency: 4 }
  );

  const { isProcessing, isProcessingComplete, statusCounts, tasks } =
    processState;

  const [destinationList, onDestinationChange] = useState(() =>
    getInitialDestinationList(key, current?.prefix)
  );

  const onActionStart = () => {
    handleProcess({
      config: getInput(),
      destinationPrefix: getDestinationListFullPrefix(destinationList),
    });
  };

  const onActionCancel = () => {
    tasks.forEach((task) => {
      if (isFunction(task.cancel)) task.cancel();
    });
  };

  const onExit = () => {
    // clear files state
    dispatchStoreAction({ type: 'RESET_LOCATION_ITEMS' });
    // clear selected action
    dispatchStoreAction({ type: 'RESET_ACTION_TYPE' });
    if (isFunction(_onExit)) _onExit(current);
  };

  const onTaskCancel = useCallback(
    (task: Task) => {
      isProcessing ? task.cancel() : task.remove();
    },
    [isProcessing]
  );

  return {
    destinationList,
    isProcessing,
    isProcessingComplete,
    location,
    statusCounts,
    tasks,
    onActionCancel,
    onActionStart,
    onDestinationChange,
    onExit,
    onTaskCancel,
  };
};