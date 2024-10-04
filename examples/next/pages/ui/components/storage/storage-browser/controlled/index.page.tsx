import React from 'react';
import { useRouter } from 'next/router';

import { Button, Flex } from '@aws-amplify/ui-react';

import '@aws-amplify/ui-react-storage/storage-browser-styles.css';
import '@aws-amplify/ui-react-storage/styles.css';

function Example() {
  const router = useRouter();

  const bucket = 'bucket';
  const permssion = 'permission';
  const prefix = 'prefix';
  const query = { bucket, permssion, prefix };

  return (
    <Flex>
      <Button
        onClick={() => {
          router.push({
            pathname: `${router.pathname}/location-detail`,
            query,
          });
        }}
      >
        Go to Location Detail
      </Button>
    </Flex>
  );
}

export default Example;
