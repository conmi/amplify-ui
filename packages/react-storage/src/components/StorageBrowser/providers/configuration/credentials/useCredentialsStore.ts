import React from 'react';

import { isFunction } from '@aws-amplify/ui';

import {
  CreateCredentialsStoreInput,
  CredentialsStore,
  RegisterAuthListener,
} from './types';
import { createLocationCredentialsStore } from '../../../credentials/store';
import { GetLocationCredentials } from '../../../credentials/types';
import { LocationType } from '../../../actions';

const getScope = ({
  bucket,
  prefix,
  type,
}: {
  bucket: string;
  prefix: string;
  type: LocationType;
}): string =>
  type === 'OBJECT' ? `s3://${bucket}/${prefix}` : `s3://${bucket}/${prefix}*`;

const createCredentialsStore = ({
  ...input
}: CreateCredentialsStoreInput): CredentialsStore => {
  const { destroy, getProvider } = createLocationCredentialsStore(input);
  return {
    destroy,
    getCredentials: ({ bucket, permission, prefix, type }) =>
      getProvider({
        scope: getScope({ type, bucket, prefix }),
        permission,
      }),
  };
};

const isCredentialsStore = (
  value?: CredentialsStore
): value is CredentialsStore => isFunction(value?.getCredentials);

export function useCredentialsStore({
  getLocationCredentials: handler,
  initialValue,
  onDestroy,
  registerAuthListener,
}: {
  getLocationCredentials: GetLocationCredentials;
  initialValue?: CredentialsStore;
  onDestroy?: () => void;
  registerAuthListener: RegisterAuthListener;
}): CredentialsStore {
  const hasExistingStore = isCredentialsStore(initialValue);
  const [store, setStore] = React.useState(() =>
    hasExistingStore ? initialValue : createCredentialsStore({ handler })
  );

  const { destroy } = store;

  React.useEffect(() => {
    if (hasExistingStore) {
      return;
    }

    const handleAuthStatusChange = () => {
      destroy();

      if (isFunction(onDestroy)) {
        onDestroy();
      }

      setStore(createCredentialsStore({ handler }));
    };

    // provide `handleAuthStatusChange` to consumer
    registerAuthListener(handleAuthStatusChange);
  }, [destroy, handler, hasExistingStore, onDestroy, registerAuthListener]);

  return store;
}
