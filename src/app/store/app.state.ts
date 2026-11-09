import { GlobalState } from "./global-config/state";
import { MenuActionState } from "./menu/state";
import { ModuleParamState } from "./module-param/state";
import { OperateurState } from "./operateur/state";
import { ProfilState } from "./profil/state";
import { UserState } from "./user/state";

import { DashboardState } from "./dashboard/state";

export interface AppState {
  courierState: any;
  profilState: ProfilState;
  globalState: GlobalState;
  userState: UserState;
  operateurState: OperateurState;
  menuActionState: MenuActionState;
  moduleParamState: ModuleParamState;
  dashboardState: DashboardState;
}
