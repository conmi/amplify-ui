import {
  ActionConfigs,
  ComponentName,
  DefaultActionConfigs,
  DefaultActionKeys,
} from '../actions/configs';
import { createUseAction } from '../actions/createUseAction';
import { StorageBrowserElements } from '../context/elements';
import { Config } from '../createProvider';

interface CreateStorageBrowserInput<T extends ActionConfigs> {
  config: Config;
  elements?: Partial<StorageBrowserElements>;
  actions?: T;
}

interface CreateStorageBrowserOutput<T extends ActionConfigs> {
  StorageBrowser: {
    (props: {}): React.JSX.Element;
    displayName: string;
    Provider: (props: { children?: React.ReactNode }) => React.JSX.Element;
  } & DerivedViews<T>; // & the action derived views components
  useAction: ReturnType<typeof createUseAction<DefaultActionConfigs & T>>;
}

export interface CreateStorageBrowser {
  <
    T extends ActionConfigs &
      Partial<DefaultActionConfigs> = Partial<DefaultActionConfigs>,
  >(
    input: CreateStorageBrowserInput<T>
  ): CreateStorageBrowserOutput<T & ActionConfigs<DefaultActionKeys>>;
}

interface LocationActionViewProps<T> {
  type?: T;
}

type LocationActionViewComponent<T> = (
  props: LocationActionViewProps<T>
) => React.JSX.Element;

// Custom actions derived views
type CustomActionViews<T> = {
  readonly [K in keyof T as K extends DefaultActionKeys
    ? never
    : T[K] extends { componentName: ComponentName }
    ? T[K]['componentName']
    : never]: DerivedTaskActionViewComponent<T[K]>;
};

type ViewComponent<T, K = {}> = {
  (props: K): React.JSX.Element;
  displayName: string;
  Provider: (props: { children?: React.ReactNode }) => React.JSX.Element;
} & T;

interface DefaultActionViews {
  ListLocationItems: ViewComponent<ListLocationItemsActionViewSubComponents>;
  ListLocations: ViewComponent<ListLocationsActionViewSubComponents>;
  // temp: needs full subcomp defintions
  Upload: ViewComponent<
    BatchTaskActionViewSubComponents & { Bonus: () => React.JSX.Element }
  >;
  // temp: needs full subcomp defintions
  CreateFolder: ViewComponent<SingleTaskActionViewSubComponents>;
}

/**
 * Create derived views from both custom actions and default actions.
 *
 * One can override default actions, but the view interface of the default actions
 * remain the same.
 */
type DerivedViews<T> = CustomActionViews<T> & {
  readonly [K in keyof T as K extends keyof DefaultActionViews
    ? K
    : never]: K extends keyof DefaultActionViews
    ? DefaultActionViews[K]
    : never;
} & {
  readonly LocationActionView: LocationActionViewComponent<
    // exclude list view actions
    Exclude<keyof T, 'ListLocationItems' | 'ListLocations'>
  >;
};

/**
 * Create view & sub-components interface from action type
 */
export type DerivedTaskActionViewComponent<T> = ViewComponent<
  T extends { type: infer G }
    ? G extends 'SINGLE_ACTION'
      ? SingleTaskActionViewSubComponents
      : G extends 'BATCH_ACTION'
      ? BatchTaskActionViewSubComponents
      : never
    : never
>;

interface DefaultViewSubComponentProps {
  className?: string;
}

interface SingleTaskActionViewSubComponents {
  Title: (props: DefaultViewSubComponentProps) => React.JSX.Element;
  Trigger: (props: DefaultViewSubComponentProps) => React.JSX.Element;
  Cancel: (props: DefaultViewSubComponentProps) => React.JSX.Element;
  Message: (props: DefaultViewSubComponentProps) => React.JSX.Element;
  Destination: (props: DefaultViewSubComponentProps) => React.JSX.Element;
  Exit: (props: DefaultViewSubComponentProps) => React.JSX.Element;
}

interface BatchTaskActionViewSubComponents {
  Title: (props: DefaultViewSubComponentProps) => React.JSX.Element;
  Trigger: (props: DefaultViewSubComponentProps) => React.JSX.Element;
  Cancel: (props: DefaultViewSubComponentProps) => React.JSX.Element;
  Table: (props: DefaultViewSubComponentProps) => React.JSX.Element;
  StatusDisplay: (props: DefaultViewSubComponentProps) => React.JSX.Element;
  Destination: (props: DefaultViewSubComponentProps) => React.JSX.Element;
  Exit: (props: DefaultViewSubComponentProps) => React.JSX.Element;
}

interface ListLocationsActionViewSubComponents {
  Title: (props: DefaultViewSubComponentProps) => React.JSX.Element;
  Table: (props: DefaultViewSubComponentProps) => React.JSX.Element;
  Search: (props: DefaultViewSubComponentProps) => React.JSX.Element;
  Refresh: (props: DefaultViewSubComponentProps) => React.JSX.Element;
  Paginate: (props: DefaultViewSubComponentProps) => React.JSX.Element;
  Message: (props: DefaultViewSubComponentProps) => React.JSX.Element;
}

interface ListLocationItemsActionViewSubComponents
  extends ListLocationsActionViewSubComponents {
  ActionList: (props: DefaultViewSubComponentProps) => React.JSX.Element;
  ActionsMenu: (props: DefaultViewSubComponentProps) => React.JSX.Element;
  Navigate: (props: DefaultViewSubComponentProps) => React.JSX.Element;
}
