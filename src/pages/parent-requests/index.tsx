import { useState } from 'react';
import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Text, Button, Link, IconButton } from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getParentRequests, deleteParentRequestById } from 'apiSdk/parent-requests';
import { ParentRequestInterface } from 'interfaces/parent-request';
import { Error } from 'components/error';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { useRouter } from 'next/router';
import { FiTrash, FiEdit2 } from 'react-icons/fi';

function ParentRequestListPage() {
  const { hasAccess } = useAuthorizationApi();
  const { data, error, isLoading, mutate } = useSWR<ParentRequestInterface[]>(
    () => '/parent-requests',
    () =>
      getParentRequests({
        relations: ['parent', 'academy'],
      }),
  );
  const router = useRouter();
  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteParentRequestById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const handleView = (id: string) => {
    if (hasAccess('parent_request', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)) {
      router.push(`/parent-requests/view/${id}`);
    }
  };

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Parent Request
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {hasAccess('parent_request', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
          <Link href={`/parent-requests/create`}>
            <Button colorScheme="blue" mr="4">
              Create
            </Button>
          </Link>
        )}
        {error && <Error error={error} />}
        {deleteError && <Error error={deleteError} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>status</Th>
                  {hasAccess('parent', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>parent</Th>}
                  {hasAccess('academy', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>academy</Th>}

                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr cursor="pointer" onClick={() => handleView(record.id)} key={record.id}>
                    <Td>{record.status}</Td>
                    {hasAccess('parent', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link as={NextLink} href={`/parents/view/${record.parent?.id}`}>
                          {record.parent?.user_id}
                        </Link>
                      </Td>
                    )}
                    {hasAccess('academy', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link as={NextLink} href={`/academies/view/${record.academy?.id}`}>
                          {record.academy?.name}
                        </Link>
                      </Td>
                    )}

                    <Td>
                      {hasAccess('parent_request', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                        <Td>
                          <NextLink href={`/parent-requests/edit/${record.id}`} passHref legacyBehavior>
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
                          {hasAccess('parent_request', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(record.id);
                              }}
                              colorScheme="red"
                              variant="outline"
                              aria-label="edit"
                              icon={<FiTrash />}
                            />
                          )}
                        </Td>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </AppLayout>
  );
}
export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'parent_request',
  operation: AccessOperationEnum.READ,
})(ParentRequestListPage);
