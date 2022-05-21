export interface IRowLevel {
  id: number;
  tables: string[];
  condition: string;
  group_key: string;
  roles_includes: string[] | null;
  roles_excludes: string[] | null;
  author: string;
  changed_on: string;
}
