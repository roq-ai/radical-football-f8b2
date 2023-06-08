import { ParentInterface } from 'interfaces/parent';
import { AcademyInterface } from 'interfaces/academy';
import { GetQueryInterface } from 'interfaces';

export interface ParentRequestInterface {
  id?: string;
  status: string;
  parent_id: string;
  academy_id: string;
  created_at?: Date;
  updated_at?: Date;

  parent?: ParentInterface;
  academy?: AcademyInterface;
  _count?: {};
}

export interface ParentRequestGetQueryInterface extends GetQueryInterface {
  filter: {
    id?: string;
    status?: string;
    parent_id?: string;
    academy_id?: string;
  };
}
