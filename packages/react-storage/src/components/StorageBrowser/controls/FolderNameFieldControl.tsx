import React from 'react';

import { FolderNameField } from '../composables/FolderNameField';
import { ViewElement } from '../context/elements';
import { useFolderNameField } from './hooks/useFolderNameField';
import { useResolvedComposable } from './hooks/useResolvedComposable';
import { ControlProps } from './types';

export const FolderNameFieldControl = ({
  className,
}: ControlProps): React.JSX.Element | null => {
  const props = useFolderNameField();

  const Resolved = useResolvedComposable(FolderNameField, 'FolderNameField');

  return (
    <ViewElement className={className}>
      <Resolved {...props} />
    </ViewElement>
  );
};
