export interface Config {
  id: string;
  name: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export interface IRoute {
  id: string;
  name: string;
  path: string;
  component: React.ReactNode;
}
