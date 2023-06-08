import axios from 'axios';
import queryString from 'query-string';
import { PlayerNoteInterface, PlayerNoteGetQueryInterface } from 'interfaces/player-note';
import { GetQueryInterface } from '../../interfaces';

export const getPlayerNotes = async (query?: PlayerNoteGetQueryInterface) => {
  const response = await axios.get(`/api/player-notes${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createPlayerNote = async (playerNote: PlayerNoteInterface) => {
  const response = await axios.post('/api/player-notes', playerNote);
  return response.data;
};

export const updatePlayerNoteById = async (id: string, playerNote: PlayerNoteInterface) => {
  const response = await axios.put(`/api/player-notes/${id}`, playerNote);
  return response.data;
};

export const getPlayerNoteById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/player-notes/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deletePlayerNoteById = async (id: string) => {
  const response = await axios.delete(`/api/player-notes/${id}`);
  return response.data;
};
