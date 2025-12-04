export interface Result {
  gameId: string;
  eventTime: string;
  results: string[];
  createdAt: string;
  links: {
    game: string;
  };
}
