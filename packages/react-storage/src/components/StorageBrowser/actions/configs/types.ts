import { Permission } from '../../storage-internal';
import { IconVariant } from '../../context/elements';

import {
  ListLocationsHandler,
  ListLocationItemsHandler,
  LocationItem,
  LocationItemType,
  UploadHandler,
  CreateFolderHandler,
} from '../handlers';
import { TaskHandler } from '../types';

type StringWithoutSpaces<T extends string> = Exclude<
  T,
  ` ${string}` | `${string} ` | `${string} ${string}`
>;

export type ComponentName = Capitalize<`${string}View`>;
type ActionName = StringWithoutSpaces<string>;

/**
 * native OS file picker type. to restrict selectable file types, define the picker types
 * followed by accepted file types as strings
 * @example
 * ```ts
 * type JPEGOnly = ['FOLDER', '.jpeg'];
 * ```
 */
export type SelectionType = LocationItemType | [LocationItemType, ...string[]];

export interface ActionConfigTemplate<T> {
  /**
   * The name of the component associated with the action
   */
  componentName: ComponentName;

  /**
   * action handler
   */
  handler: T;
}

export interface ActionListItemConfig {
  /**
   * conditionally disable item selection based on currently selected values
   * @default false
   */
  disable?: (selectedValues: LocationItem[] | undefined) => boolean;

  /**
   * open native OS file picker with associated selection type on item select
   */
  fileSelection?: SelectionType;

  /**
   * conditionally render list item based on location permission
   * @default false
   */
  hide?: (permission: Permission) => boolean;

  /**
   * list item icon
   */
  icon: IconVariant | Exclude<React.ReactNode, string>;

  /**
   * list item label
   */
  label: string;
}

type IsCancelableTaskHandler<T> = T extends TaskHandler<
  any,
  { result: Promise<infer K> }
>
  ? 'CANCELED' extends K
    ? true
    : false
  : never;

/**
 * defines an action to be included in the actions list of the `LocationDetailView` with
 * a dedicated subcomponent of the `LocationActionView`
 */
export interface TaskActionConfig<T extends TaskHandler>
  extends ActionConfigTemplate<T> {
  /**
   * configure action list item behavior. provide multiple configs
   * to create additional list items for a single action
   */
  actionsListItemConfig?: ActionListItemConfig | ActionListItemConfig[];

  /**
   * whether the action allows inflight cancellation
   */
  isCancelable: IsCancelableTaskHandler<T>;

  /**
   * default display name value displayed on action view
   */
  displayName: string;

  /**
   * sets action view subcomponent type and action processing behavior
   */
  type: 'BATCH_ACTION' | 'SINGLE_ACTION';
}

export interface ListActionConfig<T> extends ActionConfigTemplate<T> {}

export interface UploadActionConfig extends TaskActionConfig<UploadHandler> {
  componentName: 'UploadView';
}

export interface CreateFolderActionConfig
  extends TaskActionConfig<CreateFolderHandler> {
  componentName: 'CreateFolderView';
}

export interface ListLocationsActionConfig
  extends ListActionConfig<ListLocationsHandler> {
  componentName: 'LocationsView';
  displayName: string;
}

export interface ListLocationItemsActionConfig
  extends ListActionConfig<ListLocationItemsHandler> {
  componentName: 'LocationDetailView';
  displayName: (
    bucket: string | undefined,
    prefix: string | undefined
  ) => string;
}

export interface DefaultActionConfigs {
  ListLocationItems: ListLocationItemsActionConfig;
  ListLocations: ListLocationsActionConfig;
  CreateFolder: CreateFolderActionConfig;
  Upload: UploadActionConfig;
}

export type DefaultActionKeys = keyof DefaultActionConfigs;

export type ActionConfigs<ActionsKeys extends ActionName = ActionName> = Record<
  ActionsKeys,
  | ListLocationItemsActionConfig
  | ListLocationsActionConfig
  | CreateFolderActionConfig
  | UploadActionConfig
  | TaskActionConfig<TaskHandler>
>;

export type ResolveActionHandler<T> = T extends
  | TaskActionConfig<infer K>
  | ListActionConfig<infer K>
  ? K
  : never;

export type ResolveActionHandlers<T> = {
  [K in keyof T]: ResolveActionHandler<T[K]>;
};
