import { AuthActions } from './auth/auth';

export type LogAction = ReturnType<(typeof AuthActions)[keyof typeof AuthActions]>;
