import * as yup from 'yup';
import { playerValidationSchema } from 'validationSchema/players';
import { playerNoteValidationSchema } from 'validationSchema/player-notes';

export const coachValidationSchema = yup.object().shape({
  user_id: yup.string().nullable().required(),
  academy_id: yup.string().nullable().required(),
  player: yup.array().of(playerValidationSchema),
  player_note: yup.array().of(playerNoteValidationSchema),
});
