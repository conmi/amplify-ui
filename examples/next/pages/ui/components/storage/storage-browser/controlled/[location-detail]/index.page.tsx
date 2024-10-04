import { Button, Flex } from '@aws-amplify/ui-react';

import { useRouter } from 'next/router';

export default function Page(props) {
  const router = useRouter();

  const query = {
    bucket: 'other bucket',
    permssion: 'other permission',
    prefix: 'other prefix',
  };
  const handleClick = (e) => {
    e.preventDefault();
    router.replace({ query });
  };

  return (
    <Flex>
      <Button onClick={handleClick}>bucket: {router.query.bucket}</Button>
    </Flex>
  );
}
