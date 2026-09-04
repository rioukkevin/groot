import * as migration_20260904_111335_initial from './20260904_111335_initial';

export const migrations = [
  {
    up: migration_20260904_111335_initial.up,
    down: migration_20260904_111335_initial.down,
    name: '20260904_111335_initial'
  },
];
