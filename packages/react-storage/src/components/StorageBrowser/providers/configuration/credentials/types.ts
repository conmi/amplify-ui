import React from 'react';

import {
  LocationCredentialsProvider,
  Permission,
} from '../../../storage-internal';
import {
  CreateLocationCredentialsStoreInput,
  GetLocationCredentials,
  LocationCredentialsStore,
} from '../../../credentials/types';
import { LocationType } from '../../../actions';

export type RegisterAuthListener = (onStateChange: () => void) => void;

export type GetCredentials = (input: {
  bucket: string;
  permission: Permission;
  prefix: string;
  type: LocationType;
}) => LocationCredentialsProvider;

export interface CredentialsStore
  extends Omit<LocationCredentialsStore, 'getProvider'> {
  getCredentials: GetCredentials;
}

export interface CreateCredentialsStoreInput
  extends CreateLocationCredentialsStoreInput {}

export interface CredentialsProviderProps {
  children?: React.ReactNode;
  getLocationCredentials: GetLocationCredentials;
  onDestroy?: () => void;
  registerAuthListener: RegisterAuthListener;
}
