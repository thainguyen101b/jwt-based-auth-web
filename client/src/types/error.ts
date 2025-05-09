// RFC 7807
export interface ApiError {
    type: string;
    title: string;
    status: number;
    detail: string;
    instance?: string;
}