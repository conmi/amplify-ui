import React from 'react';
import { useRouter } from 'next/router';

import { Flex } from '@aws-amplify/ui-react';

import { SignOutButton } from '../components';
import { StorageBrowser } from '../StorageBrowser';

import '@aws-amplify/ui-react-storage/storage-browser-styles.css';
import '@aws-amplify/ui-react-storage/styles.css';

function Locations() {
  const router = useRouter();

  return (
    <Flex direction="column">
      <SignOutButton
        onSignOut={() => {
          router.replace(router.pathname.replace('[locations]', ''));
        }}
      />

      <StorageBrowser.Provider>
        <StorageBrowser.LocationsView
          onNavigate={(destination) => {
            router.push({
              pathname: `${router.pathname}/location-detail`,
              query: { ...destination },
            });
          }}
        />
      </StorageBrowser.Provider>
    </Flex>
  );
}

export default Locations;
