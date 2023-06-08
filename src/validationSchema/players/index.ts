import * as yup from 'yup';
import { parentValidationSchema } from 'validationSchema/parents';
import { playerNoteValidationSchema } from 'validationSchema/player-notes';

export const playerValidationSchema = yup.object().shape({
  name: yup.string().required(),
  status: yup.string().required(),
  user_id: yup.string().nullable().required(),
  academy_id: yup.string().nullable().required(),
  coach_id: yup.string().nullable().required(),
  parent: yup.array().of(parentValidationSchema),
  player_note: yup.array().of(playerNoteValidationSchema),
});
