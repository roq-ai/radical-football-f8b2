import { ParentRequestInterface } from 'interfaces/parent-request';
import { UserInterface } from 'interfaces/user';
import { PlayerInterface } from 'interfaces/player';
import { GetQueryInterface } from 'interfaces';

export interface ParentInterface {
  id?: string;
  user_id: string;
  player_id: string;
  created_at?: Date;
  updated_at?: Date;
  parent_request?: ParentRequestInterface[];
  user?: UserInterface;
  player?: PlayerInterface;
  _count?: {
    parent_request?: number;
  };
}

export interface ParentGetQueryInterface extends GetQueryInterface {
  filter: {
    id?: string;
    user_id?: string;
    player_id?: string;
  };
}
