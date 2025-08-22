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

export interface FetchNotesResponse {
    notes: Note[];
    totalPages: number;
    currentPage: number;
    totalNotes: number;
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

export const fetchNotes = async ({
    page = 1,
    query = "",
}: FetchNotesParams): Promise<FetchNotesResponse> => {
    const params = new URLSearchParams({ page: String(page), perPage: "12" });
    if (query) params.append("search", query);

    const response = await apiClient.get<FetchNotesResponse>(
        `/notes?${params.toString()}`
    );
    return response.data;
};

export const createNote = async (noteData: NewNotePayload): Promise<Note> => {
    const response = await apiClient.post<Note>("/notes", noteData);
    return response.data;
};

/**
 * Функція для видалення нотатки за її ID.
 * @param {string} noteId - Ідентифікатор нотатки для видалення.
 * @returns {Promise<void>} - Проміс, що завершується без даних.
 */
export const deleteNote = async (noteId: string): Promise<void> => {
    if (!noteId) {
        throw new Error("Note ID is required for deletion");
    }
    await apiClient.delete(`/notes/${noteId}`);
};
