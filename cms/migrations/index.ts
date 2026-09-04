import * as migration_20260904_111335_initial from './20260904_111335_initial';
import * as migration_20260904_131737_roles_where_optional from './20260904_131737_roles_where_optional';

export const migrations = [
  {
    up: migration_20260904_111335_initial.up,
    down: migration_20260904_111335_initial.down,
    name: '20260904_111335_initial',
  },
  {
    up: migration_20260904_131737_roles_where_optional.up,
    down: migration_20260904_131737_roles_where_optional.down,
    name: '20260904_131737_roles_where_optional'
  },
];
