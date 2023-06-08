import * as yup from 'yup';
import { parentRequestValidationSchema } from 'validationSchema/parent-requests';

export const parentValidationSchema = yup.object().shape({
  user_id: yup.string().nullable().required(),
  player_id: yup.string().nullable().required(),
  parent_request: yup.array().of(parentRequestValidationSchema),
});
