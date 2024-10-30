import { AsyncDataAction } from '@aws-amplify/ui-react-core';
import {
  ListHandler,
  ListHandlerOptions,
  ListHandlerInput,
  ListHandlerOutput,
} from './types';

export interface EndhancedListHandlerOptions extends ListHandlerOptions {
  refresh?: boolean;
  reset?: boolean;
}

interface EndhancedListHandler<T, K>
  extends AsyncDataAction<
    ListHandlerOutput<K>,
    ListHandlerInput<EndhancedListHandlerOptions & T>
  > {}

export const createEnhancedListHandler = <T extends ListHandlerOptions, K>(
  action: ListHandler<ListHandlerInput<T>, ListHandlerOutput<K>>
): EndhancedListHandler<T, K> => {
  return async function listActionHandler(
    prevState,
    { options: _options, ...input }
  ) {
    const { nextToken: _nextToken, refresh, reset, ...rest } = _options ?? {};

    if (reset) {
      return { items: [], nextToken: undefined };
    }

    // ignore provided `nextToken` on `refresh`
    const nextToken = refresh ? undefined : _nextToken;

    const options = { ...rest, nextToken } as T;
    const output = await action({ ...input, options });

    return {
      items: [...(refresh ? [] : prevState.items)],
      nextToken: output.nextToken,
    };
  };
};
