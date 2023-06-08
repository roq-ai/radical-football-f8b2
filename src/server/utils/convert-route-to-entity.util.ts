const mapping: Record<string, string> = {
  academies: 'academy',
  coaches: 'coach',
  parents: 'parent',
  'parent-requests': 'parent_request',
  players: 'player',
  'player-notes': 'player_note',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
