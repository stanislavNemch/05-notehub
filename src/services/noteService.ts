import axios from "axios";
import type { Note, NoteTag } from "../types/note";

const apiClient = axios.create({
    baseURL: "https://notehub-public.goit.study/api",
});

apiClient.interceptors.request.use((config) => {
    const token = import.meta.env.VITE_NOTEHUB_TOKEN;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Тип відповіді для списку нотаток, яке реально повертає API
export interface FetchNotesResponse {
    notes: Note[];
    totalPages: number;
}

interface FetchNotesParams {
    page?: number;
    query?: string;
}

export interface NewNotePayload {
    title: string;
    content: string;
    tag: NoteTag;
}

// Отримання списку нотаток з урахуванням пагінації та пошуку
export const fetchNotes = async ({
    page = 1,
    query = "",
}: FetchNotesParams): Promise<FetchNotesResponse> => {
    const response = await apiClient.get<FetchNotesResponse>("/notes", {
        params: {
            page,
            perPage: 12,
            ...(query ? { search: query } : {}),
        },
    });
    return response.data;
};

// Створення нової нотатки
export const createNote = async (noteData: NewNotePayload): Promise<Note> => {
    const response = await apiClient.post<Note>("/notes", noteData);
    return response.data;
};

/**
 * Видалення нотатки за ID.
 * ПОВЕРТАЄМО видалену нотатку (як це робить API), а не void.
 */
export const deleteNote = async (noteId: string): Promise<Note> => {
    if (!noteId) {
        throw new Error("Note ID is required for deletion");
    }
    const response = await apiClient.delete<Note>(`/notes/${noteId}`);
    return response.data;
};
