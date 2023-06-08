import { CoachInterface } from 'interfaces/coach';
import { ParentRequestInterface } from 'interfaces/parent-request';
import { PlayerInterface } from 'interfaces/player';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface AcademyInterface {
  id?: string;
  name: string;
  description?: string;
  image?: string;
  created_at?: Date;
  updated_at?: Date;
  user_id: string;
  tenant_id: string;
  coach?: CoachInterface[];
  parent_request?: ParentRequestInterface[];
  player?: PlayerInterface[];
  user?: UserInterface;
  _count?: {
    coach?: number;
    parent_request?: number;
    player?: number;
  };
}

export interface AcademyGetQueryInterface extends GetQueryInterface {
  filter: {
    id?: string;
    name?: string;
    description?: string;
    image?: string;
    user_id?: string;
    tenant_id?: string;
  };
}
