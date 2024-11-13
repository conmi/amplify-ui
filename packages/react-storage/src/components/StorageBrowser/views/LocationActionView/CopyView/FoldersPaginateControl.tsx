import React from 'react';
import { PaginateControl } from '../../../views/Controls/Paginate';

import { createContextUtilities } from '@aws-amplify/ui-react-core';

interface PaginateProps extends React.ComponentProps<typeof PaginateControl> {}

const defaultValue: PaginateProps = {};
export const { FoldersPaginateProvider, useFoldersPaginate } =
  createContextUtilities({ contextName: 'FoldersPaginate', defaultValue });

export const FoldersPaginateControl = (): React.JSX.Element => {
  const props = useFoldersPaginate();

  return <PaginateControl {...props} />;
};

FoldersPaginateControl.displayName = 'FoldersPaginate';
