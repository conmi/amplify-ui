import * as React from 'react';
import { tabsClasses } from '@aws-amplify/ui';

import { ForwardRefPrimitive, Primitive } from '../types';
import { View } from '../View';
import { BaseTabsPanelProps, TabsPanelProps } from './types';
import { primitiveWithForwardRef } from '../utils/primitiveWithForwardRef';
import { TabsContext } from './TabsContext';

const TabPanelPrimitive: Primitive<TabsPanelProps, 'div'> = (
  { className, value, children, role = 'tabpanel', ...rest },
  ref
) => {
  const { activeTab, isLazy } = React.useContext(TabsContext);

  if (isLazy && activeTab !== value) return null;

  return (
    <View
      {...rest}
      role={role}
      id={`${value}-panel`}
      aria-labelledby={`${value}-tab`}
      className={tabsClasses(
        {
          _element: {
            panel: [activeTab === value ? 'active' : undefined],
          },
        },
        [className]
      )}
      ref={ref}
    >
      {children}
    </View>
  );
};

/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/tabs)
 */
export const TabPanel: ForwardRefPrimitive<BaseTabsPanelProps, 'div'> =
  primitiveWithForwardRef(TabPanelPrimitive);

TabPanel.displayName = 'Tabs.Panel';
