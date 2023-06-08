import { PlayerInterface } from 'interfaces/player';
import { PlayerNoteInterface } from 'interfaces/player-note';
import { UserInterface } from 'interfaces/user';
import { AcademyInterface } from 'interfaces/academy';
import { GetQueryInterface } from 'interfaces';

export interface CoachInterface {
  id?: string;
  user_id: string;
  academy_id: string;
  created_at?: Date;
  updated_at?: Date;
  player?: PlayerInterface[];
  player_note?: PlayerNoteInterface[];
  user?: UserInterface;
  academy?: AcademyInterface;
  _count?: {
    player?: number;
    player_note?: number;
  };
}

export interface CoachGetQueryInterface extends GetQueryInterface {
  filter: {
    id?: string;
    user_id?: string;
    academy_id?: string;
  };
}
