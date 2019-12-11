import SetEntity from '../../../src/core/form/SetEntity'
import fields from './fields'
import uuid from 'uuid/v4'
jest.mock('uuid/v4')

describe('run', (): void => {
  test('with entity', (): void => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    uuid.mockImplementation(() => 'test-uuid')
    const entity = {
      name: 'Test',
      challengeType: 'weekly',
      rewards: [{ spin: 1 }, { ticket: 2 }],
      data: {
        static: { test: 1 },
        dynamic: [{ roles: [2], conditions: [{ type: 'last_play', redundantKey: 'redundantValue' }] }],
      },
      redundantKey: 'redundantValue',
    }
    expect(SetEntity.run(fields, entity)).toEqual({
      name: 'Test',
      challengeType: 'weekly',
      rewards: [
        { __uuid: 'test-uuid', spin: 1 },
        { __uuid: 'test-uuid', ticket: 2 },
      ],
      data: {
        static: { test: 1 },
        dynamic: [{ __uuid: 'test-uuid', roles: [2], conditions: [{ __uuid: 'test-uuid', type: 'last_play' }] }],
      },
    })
  })

  test('without entity', (): void => {
    expect(SetEntity.run(fields, {})).toEqual({
      name: undefined,
      challengeType: undefined,
      rewards: [],
      data: {
        static: undefined,
        dynamic: [],
      },
    })
  })
})

describe('getDefaultValue', (): void => {
  test('type select', (): void => {
    expect(
      SetEntity.run(
        [
          {
            name: 'type',
            label: 'Type',
            type: 'select',
            options: [
              { value: 'milestone', label: 'Milestone' },
              { value: '', label: 'Empty' },
            ],
          },
        ],
        {}
      )
    ).toEqual({ type: 'milestone' })
  })

  test('type: `select`, multiple: true', (): void => {
    expect(
      SetEntity.run(
        [
          {
            name: 'type',
            label: 'Type',
            type: 'select',
            options: [
              { value: 'milestone', label: 'Milestone' },
              { value: '', label: 'Empty' },
            ],
            multiple: true,
          },
        ],
        {}
      )
    ).toEqual({ type: [] })
  })

  test('type: `select`, allowEmpty: true', (): void => {
    expect(
      SetEntity.run(
        [
          {
            name: 'type',
            label: 'Type',
            type: 'select',
            options: [
              { value: 'milestone', label: 'Milestone' },
              { value: '', label: 'Empty' },
            ],
            allowEmpty: true,
          },
        ],
        {}
      )
    ).toEqual({ type: undefined })
  })
})
