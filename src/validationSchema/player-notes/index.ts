import * as yup from 'yup';

export const playerNoteValidationSchema = yup.object().shape({
  note: yup.string().required(),
  player_id: yup.string().nullable().required(),
  coach_id: yup.string().nullable().required(),
});
