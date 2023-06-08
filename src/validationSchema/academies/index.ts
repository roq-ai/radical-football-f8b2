import * as yup from 'yup';
import { coachValidationSchema } from 'validationSchema/coaches';
import { parentRequestValidationSchema } from 'validationSchema/parent-requests';
import { playerValidationSchema } from 'validationSchema/players';

export const academyValidationSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string(),
  image: yup.string(),
  tenant_id: yup.string().required(),
  user_id: yup.string().nullable().required(),
  coach: yup.array().of(coachValidationSchema),
  parent_request: yup.array().of(parentRequestValidationSchema),
  player: yup.array().of(playerValidationSchema),
});
