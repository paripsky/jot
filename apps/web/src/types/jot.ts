export type JotItem = {
  id: string;
  updatedAt: string;
  createdAt: string;
  type: string;
  data: string | unknown;
};

export type JotEntry = {
  id: string;
  name: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
};

export type Jot = {
  id: string;
  name: string;
  updatedAt: string;
  createdAt: string;
  items: JotItem[];
  icon?: string;

  // the version of this jot - needed for jot migration in the future
  version?: string;
};
