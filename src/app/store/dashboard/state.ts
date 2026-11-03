import { CamembertTacheDto, HistogrammeTacheDto } from './model';

export interface DashboardState {
  histogramme: Record<string, number>;
  camembert: Record<string, number>;
  error: any;
  agents: any[];

}

export const initialDashboardState: DashboardState = {
  histogramme: {},
  camembert: {},
  error: null,
  agents: []
};
