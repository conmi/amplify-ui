import React from 'react';

import { assertLocationData } from '../../validators';
import { useStore } from '../store';

import { useCredentials } from './credentials';
import { GetActionInput } from './types';
import { LocationData } from '../../actions';

export const ERROR_MESSAGE =
  'Unable to resolve credentials due to invalid value of `locationData`.';

export function useGetActionInputCallback({
  accountId,
  customEndpoint,
  region,
}: {
  accountId?: string;
  customEndpoint?: string;
  region: string;
}): GetActionInput {
  const { getCredentials } = useCredentials();
  const [{ location }] = useStore();
  const { current, key } = location;

  return React.useCallback(
    (location?: LocationData) => {
      const _location = current ?? location;
      const _prefix = current ? key : location?.prefix;
      assertLocationData(_location, ERROR_MESSAGE);

      const { bucket, permission, type } = _location;

      return {
        accountId,
        bucket,
        credentials: getCredentials({
          bucket,
          permission,
          prefix: _prefix!,
          type,
        }),
        region,
        customEndpoint,
      };
    },
    [accountId, current, customEndpoint, getCredentials, key, region]
  );
}
