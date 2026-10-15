import * as migration_20260605_222603 from './20260605_222603';
import * as migration_20260606_000001 from './20260606_000001';
import * as migration_20260606_000002 from './20260606_000002';
import * as migration_20260612_234320_add_phone_field from './20260612_234320_add_phone_field';
import * as migration_20261015_000001_add_rate_limits from './20261015_000001_add_rate_limits';

export const migrations = [
  {
    up: migration_20260605_222603.up,
    down: migration_20260605_222603.down,
    name: '20260605_222603',
  },
  {
    up: migration_20260606_000001.up,
    down: migration_20260606_000001.down,
    name: '20260606_000001',
  },
  {
    up: migration_20260606_000002.up,
    down: migration_20260606_000002.down,
    name: '20260606_000002',
  },
  {
    up: migration_20260612_234320_add_phone_field.up,
    down: migration_20260612_234320_add_phone_field.down,
    name: '20260612_234320_add_phone_field'
  },
  {
    up: migration_20261015_000001_add_rate_limits.up,
    down: migration_20261015_000001_add_rate_limits.down,
    name: '20261015_000001_add_rate_limits',
  },
];
