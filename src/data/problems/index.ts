
export interface ProblemManifest {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export const problemManifests: ProblemManifest[] = [
  { id: 'two-sum', title: 'Two Sum', difficulty: 'Easy' },
  { id: 'generate-parentheses', title: 'Generate Parentheses', difficulty: 'Medium' },
  { id: 'nba-team-trade', title: 'NBA Team Trade Execution', difficulty: 'Easy' },
  { id: 'nvidia-stock-highs', title: 'NVIDIA and the AI Boom: The Next All-Time High', difficulty: 'Medium' },
];
