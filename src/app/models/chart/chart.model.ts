import { IUser } from "../user/user.model";

export interface IChart {
        cache_timeout: number;
        changed_by?: IUser;
        changed_by_name?: string;
        changed_on_delta_humanized?: string;
        changed_on_utc?: string;
        created_by?: IUser;
        datasource_id?: number;
        datasource_name_text?: string;
        datasource_type?: string;
        datasource_url?: string;
        description?: string;
        description_markeddown?: string;
        edit_url?: string;
        id?: number;
        owners?: Array<IUser>;
        params?: string;
        slice_name?: string;
        table?: any;
        thumbnail_url: string;
        url: string;
        viz_type: string;
        last_saved_by: any;
}
