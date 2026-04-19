export interface Todo {
    id: number;
    title: string;
    description?: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    createdAt: string;
    userId: number;
    dueDate?: string | null;
}

export interface FeatureState {
    data: any[];
    loading: boolean;
    error: string | null;
}