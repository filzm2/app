import { IUser } from '../user/user.model';

export interface IDashboard {
    changed_by?: {
        username: string;
    };
    changed_by_name?: any;
    changed_by_url?: any;
    changed_on?: string;
    charts?: any;
    css?: string;
    dashboard_title?: string;
    id?: number;
    json_metadata?: string;
    owners?: IUser;
    position_json?: string;
    published?: boolean;
    slug?: string;
    table_names?: any;
    thumbnail_url?: any;
    url?: any;
}

// пока что только для time filter, соответственно type это тип time filter, а не общий
export interface IDashboardFilter {
    name: string;
    type: string;
    default: boolean;
    data: any;
}

export interface IDashboardIntervalType {
    value: number;
    name: string;
}

// 'comments_id': record.id,
//             'user': {
//                 'id': record.user.id,
//                 'fio': ' '.join([record.user.first_name, record.user.last_name])
//             },
//             'date': str(record.changed_on) if record.changed_on else str(record.craeated_on),
//             'comment': record.comment,
//             'status': record.status

// status: может быть 1, 2, 3 (коммент, вопрос, восклицание)

export interface IDashboardComment {
    comments_id: number;
    user: {
        id: number;
        fio: string;
    };
    date: string;
    comment: string;
    status: number;
}
