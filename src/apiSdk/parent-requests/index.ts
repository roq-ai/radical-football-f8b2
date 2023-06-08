import axios from 'axios';
import queryString from 'query-string';
import { ParentRequestInterface, ParentRequestGetQueryInterface } from 'interfaces/parent-request';
import { GetQueryInterface } from '../../interfaces';

export const getParentRequests = async (query?: ParentRequestGetQueryInterface) => {
  const response = await axios.get(`/api/parent-requests${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createParentRequest = async (parentRequest: ParentRequestInterface) => {
  const response = await axios.post('/api/parent-requests', parentRequest);
  return response.data;
};

export const updateParentRequestById = async (id: string, parentRequest: ParentRequestInterface) => {
  const response = await axios.put(`/api/parent-requests/${id}`, parentRequest);
  return response.data;
};

export const getParentRequestById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/parent-requests/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteParentRequestById = async (id: string) => {
  const response = await axios.delete(`/api/parent-requests/${id}`);
  return response.data;
};
