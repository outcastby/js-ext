// import resources from '../../src/router/resources'
import React from 'react'

test('ddd', (): void => {
  // console.log('react', React)
  expect(1).toEqual(1)
})

// import { ComponentHOC } from '../../src/router/resources'
//
// export const New: ComponentHOC = (): React.FC => {
//   return () => <div />
// }
// export const Edit: ComponentHOC = (): React.FC => {
//   return () => <div />
// }
// export const Show: ComponentHOC = (): React.FC => {
//   return () => <div />
// }
//
// test('correct routers', (): void => {
//   const views = {
//     custom: {},
//     crud: {
//       components: {
//         New,
//         Edit,
//         Show,
//       },
//       settings: {
//         cdnServers: {
//           gql: {
//             create: 'some query',
//             update: 'some query',
//             show: 'some query',
//           },
//         },
//       },
//     },
//   }
//   const result = [
//     {
//       schema: { resource: 'cdn_servers', action: 'edit' },
//       path: '/cdn_servers/new',
//       component: { compare: null, displayName: 'Connect(Component)' },
//     },
//     {
//       schema: { resource: 'cdn_servers', action: 'edit' },
//       path: '/cdn_servers/:id/edit',
//       component: { compare: null, displayName: 'Connect(Component)' },
//     },
//     {
//       schema: { resource: 'cdn_servers', action: 'view' },
//       path: '/cdn_servers/:id/show',
//       component: { compare: null, displayName: 'Connect(Component)' },
//     },
//     {
//       schema: { resource: 'cdn_servers', action: 'view' },
//       path: '/cdn_servers',
//       name: 'Cdn_servers',
//       component: { compare: null, displayName: 'Connect(Component)' },
//       exact: true,
//     },
//     { path: '/cdn_servers/test_action' },
//   ]
//   expect(resources(views, 'cdn_servers', [{ routeAction: 'test_action' }])).toEqual(result)
// })
