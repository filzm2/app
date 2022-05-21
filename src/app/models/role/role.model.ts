export interface IRole {
  id?: number;
  name: string;
  users: any[];

  permissions: IAllPermissions;
}

export interface IAllPermissions {

  // can_connect_to_db: boolean;
  can_create_db?: boolean;
  can_edit_udbmv?: boolean;
  can_delete_udbmv?: boolean;
  can_read_udbmv?: boolean;
  can_create_udbmv?: boolean;
  can_create_rmv?: boolean;
  can_edit_rmv?: boolean;
  can_delete_rmv?: boolean;
  // available_reset_my_password: boolean;
  // can_delete_rmv: boolean;

  can_edit_dataset?: boolean;
  can_create_dataset?: boolean;
  can_create_dashboard?: boolean;
  can_edit_dashboard?: boolean;
  can_create_chart?: boolean;
  // can_filter_dashboard: boolean;
  // can_edit_profile: boolean;
  // can_edit_favorite_status: boolean;
  // available_sql: boolean;

  // can_read_saved_query: boolean;
  // can_read_annotation: boolean;
  can_read_dataset?: boolean;
  can_read_database?: boolean;
  can_read_dashboard?: boolean;
  can_read_chart?: boolean;
  can_read_rmv?: boolean;
  // can_read_control_panel: boolean;
  can_read_log?: boolean;
  can_comment?: boolean;
}
