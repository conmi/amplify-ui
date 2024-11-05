import { act, renderHook, waitFor } from '@testing-library/react';

import {
  ActionInputConfig,
  TaskHandlerInput,
  TaskHandlerOptions,
  TaskHandlerOutput,
} from '../../actions';
import { FileItem } from '../../providers';

import { useProcessTasks } from '../../tasks/useProcessTasks';

const config: ActionInputConfig = {
  accountId: 'accountId',
  bucket: 'bucket',
  credentials: jest.fn(),
  region: 'region',
};

const prefix = 'prefix';

const items: FileItem[] = [
  { key: '0', id: '0', file: new File([], '0') },
  { key: '1', id: '1', file: new File([], '1') },
  { key: '2', id: '2', file: new File([], '2') },
];

const action = jest.fn(
  ({
    data: { key },
  }: TaskHandlerInput<
    FileItem,
    TaskHandlerOptions & { extraOption?: boolean }
  > & { prefix: string }): TaskHandlerOutput => {
    if (key === '0') {
      return {
        cancel: undefined,
        result: Promise.resolve({ status: 'COMPLETE' as const }),
      };
    }

    if (key === '1') {
      return {
        cancel: undefined,
        result: Promise.reject({ status: 'FAILED' as const }),
      };
    }

    if (key === '2') {
      return {
        cancel: undefined,
        result: Promise.resolve({ status: 'COMPLETE' as const }),
      };
    }
    throw new Error();
  }
);

const sleep = <T>(
  ms: number,
  resolvedValue: T,
  shouldReject = false
): Promise<{ status: T }> =>
  new Promise((resolve, reject) =>
    setTimeout(
      () => (shouldReject ? reject : resolve)({ status: resolvedValue }),
      ms
    )
  );

const createTimedAction =
  ({
    cancel,
    ms = 1000,
    resolvedStatus = 'COMPLETE',
    shouldReject,
  }: {
    cancel?: () => void;
    ms?: number;
    resolvedStatus?: 'COMPLETE' | 'FAILED' | 'CANCELED' | 'OVERWRITE_PREVENTED';
    shouldReject?: boolean;
  }): ((input: TaskHandlerInput & { prefix: string }) => TaskHandlerOutput) =>
  () => ({
    cancel,
    pause: undefined,
    resume: undefined,
    result: sleep(ms, resolvedStatus, shouldReject),
  });

describe('useProcessTasks', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    action.mockClear();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('handles concurrent tasks as expected', async () => {
    const { result } = renderHook(() =>
      useProcessTasks(action, items, { concurrency: 2 })
    );

    const processTasks = result.current[1];

    expect(result.current[0].tasks[0].status).toBe('QUEUED');
    expect(result.current[0].tasks[1].status).toBe('QUEUED');
    expect(result.current[0].tasks[2].status).toBe('QUEUED');

    act(() => {
      processTasks({ config, prefix });
    });

    expect(action).toHaveBeenCalledTimes(2);
    expect(action).toHaveBeenCalledWith({
      config,
      data: { key: items[0].key, id: items[0].id, file: items[0].file },
      options: { onProgress: expect.any(Function) },
      prefix,
    });
    expect(action).toHaveBeenCalledWith({
      config,
      data: { key: items[1].key, id: items[1].id, file: items[1].file },
      options: { onProgress: expect.any(Function) },
      prefix,
    });

    expect(result.current[0].tasks[0].status).toBe('PENDING');
    expect(result.current[0].tasks[1].status).toBe('PENDING');
    expect(result.current[0].tasks[2].status).toBe('QUEUED');

    await waitFor(() => {
      expect(action).toHaveBeenCalledTimes(3);
    });

    expect(result.current[0].tasks[0].status).toBe('COMPLETE');
    expect(result.current[0].tasks[1].status).toBe('FAILED');
    expect(result.current[0].tasks[2].status).toBe('COMPLETE');
  });

  it('cancels an inflight task as expected', async () => {
    const cancel = jest.fn();
    const cancelableAction = createTimedAction({
      cancel,
      resolvedStatus: 'CANCELED',
    });

    const { result } = renderHook(() =>
      useProcessTasks(cancelableAction, items)
    );

    const processTasks = result.current[1];

    expect(result.current[0].tasks[0].cancel).toBeDefined();
    expect(result.current[0].tasks[0].status).toBe('QUEUED');

    act(() => {
      processTasks({ config, prefix });
    });

    expect(result.current[0].tasks[0].cancel).toBeDefined();
    expect(result.current[0].tasks[0].status).toBe('PENDING');

    act(() => {
      result.current[0].tasks[0].cancel?.();
    });

    jest.advanceTimersToNextTimer();

    expect(cancel).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(result.current[0].tasks[0].status).toBe('CANCELED');
    });
  });

  it('cancels a QUEUED task as expected', () => {
    const cancelableAction = createTimedAction({});

    const { result } = renderHook(() =>
      useProcessTasks(cancelableAction, items)
    );

    expect(result.current[0].tasks[0].cancel).toBeDefined();
    expect(result.current[0].tasks[0].status).toBe('QUEUED');

    act(() => {
      result.current[0].tasks[0].cancel();
    });

    expect(result.current[0].tasks[0].status).toBe('CANCELED');
  });

  it.each(['COMPLETE' as const, 'FAILED' as const])(
    'does not cancel a %s task',
    async (resolvedStatus) => {
      const cancel = jest.fn();

      const cancelableAction = createTimedAction({
        cancel,
        resolvedStatus,
        shouldReject: resolvedStatus === 'FAILED',
      });

      const { result } = renderHook(() =>
        useProcessTasks(cancelableAction, items)
      );

      const processTasks = result.current[1];

      expect(result.current[0].tasks[0].status).toBe('QUEUED');

      act(() => {
        processTasks({ config, prefix });
      });

      expect(result.current[0].tasks[0].status).toBe('PENDING');

      jest.advanceTimersToNextTimer();

      await waitFor(() => {
        expect(result.current[0].tasks[0].status).toBe(resolvedStatus);
      });

      act(() => {
        result.current[0].tasks[0].cancel?.();
      });

      expect(result.current[0].tasks[0].status).toBe(resolvedStatus);
    }
  );

  it('behaves as expected in the happy path', async () => {
    const { result } = renderHook(() => useProcessTasks(action, items));

    const processTasks = result.current[1];

    expect(result.current[0].tasks[0].status).toBe('QUEUED');
    expect(result.current[0].tasks[1].status).toBe('QUEUED');
    expect(result.current[0].tasks[2].status).toBe('QUEUED');

    act(() => {
      processTasks({ config, prefix, options: { extraOption: true } });
    });

    expect(action).toHaveBeenCalledTimes(1);
    expect(action).toHaveBeenCalledWith({
      config,
      data: { key: items[0].key, id: items[0].id, file: items[0].file },
      options: { extraOption: true, onProgress: expect.any(Function) },
      prefix,
    });

    expect(result.current[0].tasks[0].status).toBe('PENDING');
    expect(result.current[0].tasks[1].status).toBe('QUEUED');
    expect(result.current[0].tasks[2].status).toBe('QUEUED');

    await waitFor(() => {
      expect(action).toHaveBeenCalledTimes(3);
    });

    expect(result.current[0].tasks[0].status).toBe('COMPLETE');
    expect(result.current[0].tasks[1].status).toBe('FAILED');
    expect(result.current[0].tasks[2].status).toBe('COMPLETE');
  });

  it('removes a task as expected', () => {
    const { result } = renderHook(() => useProcessTasks(action, items));

    const initTasks = result.current[0].tasks;
    const [task] = initTasks;

    expect(initTasks.length).toBe(3);

    act(() => {
      task.remove();
    });

    const nextTasks = result.current[0].tasks;
    expect(nextTasks.length).toBe(2);
  });

  it('does not remove an inflight task', async () => {
    const { result } = renderHook(() => useProcessTasks(action, items));

    const [initState, handleProcess] = result.current;
    const [task] = initState.tasks;

    expect(initState.tasks.length).toBe(3);

    act(() => {
      handleProcess({ config, prefix });
    });

    act(() => {
      task.remove();
    });

    await waitFor(() => {
      const nextTasks = result.current[0].tasks;
      expect(nextTasks.length).toBe(3);
    });
  });

  it('excludes adding an item with an existing task', () => {
    const { rerender, result } = renderHook((_items: FileItem[] = items) =>
      useProcessTasks(action, _items)
    );

    const initTasks = result.current[0].tasks;
    expect(initTasks.length).toBe(3);

    const nextItems = [...items];

    act(() => {
      rerender(nextItems);
    });

    const nextTasks = result.current[0].tasks;
    expect(nextTasks.length).toBe(3);
  });

  it.todo('handles progress updates as expected');
  it.todo('ignores calls to handle processing when isProcessing is true');
  it.todo('handles data provided through input as expected');
});