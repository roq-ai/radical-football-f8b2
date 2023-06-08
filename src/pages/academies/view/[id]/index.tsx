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
import { getAcademyById } from 'apiSdk/academies';
import { Error } from 'components/error';
import { AcademyInterface } from 'interfaces/academy';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { FiEdit2 } from 'react-icons/fi';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { deleteParentRequestById } from 'apiSdk/parent-requests';
import { deletePlayerById } from 'apiSdk/players';
import { deleteCoachById, createCoach } from 'apiSdk/coaches';

function AcademyViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<AcademyInterface>(
    () => (id ? `/academies/${id}` : null),
    () =>
      getAcademyById(id, {
        relations: ['user', 'parent_request', 'player', 'coach'],
      }),
  );

  const parent_requestHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteParentRequestById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const playerHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deletePlayerById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [coachUserId, setCoachUserId] = useState(null);
  const coachHandleCreate = async () => {
    setCreateError(null);
    try {
      await createCoach({ academy_id: id, user_id: coachUserId });
      setCoachUserId(null);
      await mutate();
    } catch (error) {
      setCreateError(error);
    }
  };
  const coachHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteCoachById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Academy Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            {hasAccess('academy', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
              <NextLink href={`/academies/edit/${data?.id}`} passHref legacyBehavior>
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
              Name:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.name}
            </Text>
            <br />
            <Text fontSize="lg" fontWeight="bold" as="span">
              Description:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.description}
            </Text>
            <br />
            <Text fontSize="lg" fontWeight="bold" as="span">
              Image:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.image}
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
            <Text fontSize="lg" fontWeight="bold" as="span">
              Tenant Id:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.tenant_id}
            </Text>
            <br />
            {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold" as="span">
                  User:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  <Link as={NextLink} href={`/users/view/${data?.user?.id}`}>
                    {data?.user?.email}
                  </Link>
                </Text>
              </>
            )}
            {hasAccess('parent_request', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold">
                  Parent Requests:
                </Text>
                <NextLink passHref href={`/parent-requests/create?academy_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4" as="a">
                    Create
                  </Button>
                </NextLink>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>status</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.parent_request?.map((record) => (
                        <Tr
                          cursor="pointer"
                          onClick={() => router.push(`/parent-requests/view/${record.id}`)}
                          key={record.id}
                        >
                          <Td>{record.status}</Td>
                          <Td>
                            <NextLink passHref href={`/parent-requests/edit/${record.id}`}>
                              <Button mr={2} as="a" variant="outline" colorScheme="blue" leftIcon={<FiEdit2 />}>
                                Edit
                              </Button>
                            </NextLink>
                            <IconButton
                              onClick={() => parent_requestHandleDelete(record.id)}
                              colorScheme="red"
                              variant="outline"
                              aria-label="edit"
                              icon={<FiTrash />}
                            />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}

            {hasAccess('player', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold">
                  Players:
                </Text>
                <NextLink passHref href={`/players/create?academy_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4" as="a">
                    Create
                  </Button>
                </NextLink>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>name</Th>
                        <Th>status</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.player?.map((record) => (
                        <Tr cursor="pointer" onClick={() => router.push(`/players/view/${record.id}`)} key={record.id}>
                          <Td>{record.name}</Td>
                          <Td>{record.status}</Td>
                          <Td>
                            <NextLink passHref href={`/players/edit/${record.id}`}>
                              <Button mr={2} as="a" variant="outline" colorScheme="blue" leftIcon={<FiEdit2 />}>
                                Edit
                              </Button>
                            </NextLink>
                            <IconButton
                              onClick={() => playerHandleDelete(record.id)}
                              colorScheme="red"
                              variant="outline"
                              aria-label="edit"
                              icon={<FiTrash />}
                            />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}

            <>
              <Text fontSize="lg" fontWeight="bold">
                Coaches:
              </Text>
              <UserSelect name={'coach_user'} value={coachUserId} handleChange={setCoachUserId} />
              <Button colorScheme="blue" mt="4" mr="4" onClick={coachHandleCreate} isDisabled={!coachUserId}>
                Create
              </Button>
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Email</Th>

                      <Th>View</Th>
                      <Th>Delete</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data?.coach?.map((record) => (
                      <Tr key={record?.user?.id}>
                        <Td>{record?.user?.email}</Td>

                        <Td>
                          <NextLink href={`/users/view/${record?.user?.id}`} passHref>
                            <Button as="a">View</Button>
                          </NextLink>
                        </Td>
                        <Td>
                          <Button onClick={() => coachHandleDelete(record.id)}>Delete</Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </>
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'academy',
  operation: AccessOperationEnum.READ,
})(AcademyViewPage);
