import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import React, { useState } from 'react';
import {
  Text,
  Box,
  Spinner,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  Link,
  IconButton,
} from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { FiTrash, FiEdit2 } from 'react-icons/fi';
import { getPlayerNoteById } from 'apiSdk/player-notes';
import { Error } from 'components/error';
import { PlayerNoteInterface } from 'interfaces/player-note';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { FiEdit2 } from 'react-icons/fi';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function PlayerNoteViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<PlayerNoteInterface>(
    () => (id ? `/player-notes/${id}` : null),
    () =>
      getPlayerNoteById(id, {
        relations: ['player', 'coach'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Player Note Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            {hasAccess('player_note', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
              <NextLink href={`/player-notes/edit/${data?.id}`} passHref legacyBehavior>
                <Button
                  onClick={(e) => e.stopPropagation()}
                  mr={2}
                  as="a"
                  variant="outline"
                  colorScheme="blue"
                  leftIcon={<FiEdit2 />}
                >
                  Edit
                </Button>
              </NextLink>
            )}
            <Text fontSize="lg" fontWeight="bold" as="span">
              Note:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.note}
            </Text>
            <br />
            <Text fontSize="lg" fontWeight="bold" as="span">
              Created At:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.created_at as unknown as string}
            </Text>
            <br />
            <Text fontSize="lg" fontWeight="bold" as="span">
              Updated At:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.updated_at as unknown as string}
            </Text>
            <br />
            {hasAccess('player', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Player:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  <Link as={NextLink} href={`/players/view/${data?.player?.id}`}>
                    {data?.player?.name}
                  </Link>
                </Text>
              </>
            )}
            {hasAccess('coach', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Coach:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  <Link as={NextLink} href={`/coaches/view/${data?.coach?.id}`}>
                    {data?.coach?.user_id}
                  </Link>
                </Text>
              </>
            )}
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'player_note',
  operation: AccessOperationEnum.READ,
})(PlayerNoteViewPage);
