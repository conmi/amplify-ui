import React from 'react';
import { CreateStorageBrowser } from './types';
import {
  TaskHandler,
  TaskHandlerInput,
  CancelableTaskHandlerOutput,
  ListLocationItemsHandlerOutput,
  UploadHandler,
  createFolderHandler,
} from '../actions';

import { defaultActionConfigs } from '../actions/configs/defaults';
import { listLocationItemsHandler } from '../actions';

export const createStorageBrowser: CreateStorageBrowser = (_) => {
  // TODO: implement this function
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return {} as any;
};

type MyCancelableHandler = TaskHandler<
  TaskHandlerInput<'lolz'>,
  CancelableTaskHandlerOutput
>;
const myCancelableHandler = null as unknown as MyCancelableHandler;

const { StorageBrowser } = createStorageBrowser({
  actions: {
    ...defaultActionConfigs,
    MyAction: {
      displayName: 'Custom Name',
      isCancelable: true,
      handler: myCancelableHandler,
      componentName: 'MyComponentView',
      type: 'BATCH_ACTION',
    },
    SingleTaskAction: {
      handler: createFolderHandler,
      displayName: 'Create Folder',
      componentName: 'SingleTaskActionView',
      // should be restricted to `false`
      isCancelable: true,
      type: 'SINGLE_ACTION',
    },
    ListLocationItems: {
      handler: (_input) =>
        null as unknown as Promise<ListLocationItemsHandlerOutput>,
      componentName: 'LocationDetailView',
      displayName: () => '',
    },
    Upload: {
      handler: null as unknown as UploadHandler,
      componentName: 'UploadView',
      displayName: 'Upload',
      isCancelable: true,
      type: 'BATCH_ACTION',
    },
    whatever: {
      // `ListHandler` actions should be disallowed unless
      // they match the default componentName, that they are
      // directly related to, e.g. "ListLocationItems" -> listLocationItemsHandler
      handler: listLocationItemsHandler,
      componentName: 'SillyView',
      type: 'SINGLE_ACTION',
      displayName: 'Silly',
      isCancelable: true,
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  config: {} as any,
});

function _Test(): React.JSX.Element {
  return (
    <>
      <StorageBrowser.LocationActionView type="MyAction" />
      <StorageBrowser.MyComponentView />
    </>
  );
}
