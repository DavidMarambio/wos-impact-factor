import { Ability, AbilityBuilder } from '@casl/ability'

export enum PERMISSION {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete'
}

export enum MODEL_NAMES {
  USERS = 'Users',
  PAPERS = 'Papers',
  JOURNALS = 'Journals',
  QUARTILES = 'Quartiles',
  YEARS = 'Years'
}

type AppAbilities = [
  PERMISSION,
  MODEL_NAMES
]

type AppAbility = Ability<AppAbilities>

export function defineAbilitiesForMembers () {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(Ability)
  cannot(PERMISSION.CREATE, MODEL_NAMES.USERS)
    .because('Only the admin role can create Users')
  cannot(PERMISSION.CREATE, MODEL_NAMES.YEARS)
    .because('Only the admin role can create a new year')
  can(PERMISSION.CREATE, [
    MODEL_NAMES.PAPERS,
    MODEL_NAMES.JOURNALS,
    MODEL_NAMES.QUARTILES
  ])
  can(PERMISSION.READ, MODEL_NAMES.USERS)
  can(PERMISSION.READ, [
    MODEL_NAMES.PAPERS,
    MODEL_NAMES.JOURNALS,
    MODEL_NAMES.QUARTILES,
    MODEL_NAMES.YEARS
  ])
  cannot(
    [
      PERMISSION.UPDATE,
      PERMISSION.DELETE
    ],
    [
      MODEL_NAMES.USERS,
      MODEL_NAMES.PAPERS,
      MODEL_NAMES.JOURNALS,
      MODEL_NAMES.QUARTILES,
      MODEL_NAMES.YEARS
    ])
    .because('Only the admin role can edit and delete all models')
  return build()
}

export function defineAbilitiesForAmin () {
  const { can, build } = new AbilityBuilder<AppAbility>(Ability)
  can(
    [
      PERMISSION.CREATE,
      PERMISSION.READ,
      PERMISSION.UPDATE,
      PERMISSION.DELETE
    ],
    [
      MODEL_NAMES.USERS,
      MODEL_NAMES.PAPERS,
      MODEL_NAMES.JOURNALS,
      MODEL_NAMES.QUARTILES,
      MODEL_NAMES.YEARS
    ]
  )
  return build()
}

export function defineAbilitiesForGuest () {
  const { can, build } = new AbilityBuilder<AppAbility>(Ability)
  can(PERMISSION.READ, [
    MODEL_NAMES.PAPERS,
    MODEL_NAMES.JOURNALS,
    MODEL_NAMES.QUARTILES
  ])
  return build()
}
