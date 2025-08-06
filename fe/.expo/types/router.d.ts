/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(app)` | `/(app)/chapter` | `/(app)/create` | `/(app)/create/` | `/(app)/createchapter` | `/(app)/createchapter/` | `/(app)/createchapter/friends` | `/(app)/gallery` | `/(app)/home` | `/(app)/post` | `/(app)/profile` | `/(app)/profilemodal` | `/(app)/profilemodal/edit` | `/(auth)` | `/(auth)/login` | `/(auth)/signup` | `/(aux)` | `/(aux)/profilemodal` | `/(aux)/profilemodal/edit` | `/(aux)/settings` | `/_sitemap` | `/chapter` | `/create` | `/create/` | `/createchapter` | `/createchapter/` | `/createchapter/friends` | `/gallery` | `/home` | `/login` | `/modal` | `/post` | `/profile` | `/profilemodal` | `/profilemodal/edit` | `/settings` | `/signup`;
      DynamicRoutes: `/(app)/chapter/${Router.SingleRoutePart<T>}` | `/(app)/post/${Router.SingleRoutePart<T>}` | `/chapter/${Router.SingleRoutePart<T>}` | `/post/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/(app)/chapter/[id]` | `/(app)/post/[id]` | `/chapter/[id]` | `/post/[id]`;
    }
  }
}
