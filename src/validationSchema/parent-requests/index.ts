import * as yup from 'yup';

export const parentRequestValidationSchema = yup.object().shape({
  status: yup.string().required(),
  parent_id: yup.string().nullable().required(),
  academy_id: yup.string().nullable().required(),
});
