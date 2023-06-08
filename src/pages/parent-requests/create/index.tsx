import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router';
import { createParentRequest } from 'apiSdk/parent-requests';
import { Error } from 'components/error';
import { parentRequestValidationSchema } from 'validationSchema/parent-requests';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { ParentInterface } from 'interfaces/parent';
import { AcademyInterface } from 'interfaces/academy';
import { getParents } from 'apiSdk/parents';
import { getAcademies } from 'apiSdk/academies';
import { ParentRequestInterface } from 'interfaces/parent-request';

function ParentRequestCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: ParentRequestInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createParentRequest(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<ParentRequestInterface>({
    initialValues: {
      status: '',
      parent_id: (router.query.parent_id as string) ?? null,
      academy_id: (router.query.academy_id as string) ?? null,
    },
    validationSchema: parentRequestValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Parent Request
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="status" mb="4" isInvalid={!!formik.errors?.status}>
            <FormLabel>Status</FormLabel>
            <Input type="text" name="status" value={formik.values?.status} onChange={formik.handleChange} />
            {formik.errors.status && <FormErrorMessage>{formik.errors?.status}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<ParentInterface>
            formik={formik}
            name={'parent_id'}
            label={'Select Parent'}
            placeholder={'Select Parent'}
            fetcher={getParents}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.user_id}
              </option>
            )}
          />
          <AsyncSelect<AcademyInterface>
            formik={formik}
            name={'academy_id'}
            label={'Select Academy'}
            placeholder={'Select Academy'}
            fetcher={getAcademies}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'parent_request',
  operation: AccessOperationEnum.CREATE,
})(ParentRequestCreatePage);
