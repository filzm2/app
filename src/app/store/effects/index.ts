import { ChartEffects } from './chart/chart.effects';
import { DashboardEffects } from './dashboard/dashboard.effects';
import { DashboardCommentsEffects } from './dashboard/dashboard-comments.effects';
import { DatasetEffects } from './dataset/dataset.effects';
import { LogEffects } from './log/log.effects';
import { LogUsersEffects } from './log-users/log-users.effects';
import { DatabaseEffects } from '@store/effects/database/database.effects';
import { SecurityEffects } from '@store/effects/security/security.effects';
import { TimerangeEffects } from './timerange/timerange.effects';
import { UserEffects } from './user/user.effects';

export const effects: any[] = [
  ChartEffects,
  DashboardEffects,
  DashboardCommentsEffects,
  DatasetEffects,
  LogEffects,
  LogUsersEffects,
  DatabaseEffects,
  SecurityEffects,
  TimerangeEffects,
  UserEffects,
];

export * from '@store/effects/chart/chart.effects';
