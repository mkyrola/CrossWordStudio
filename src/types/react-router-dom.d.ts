declare module 'react-router-dom' {
  import * as React from 'react';

  export interface BrowserRouterProps {
    basename?: string;
    children?: React.ReactNode;
  }

  export class BrowserRouter extends React.Component<BrowserRouterProps, any> {}
  export class Routes extends React.Component<any, any> {}
  export class Route extends React.Component<any, any> {}

  export function useNavigate(): (to: string) => void;
}
