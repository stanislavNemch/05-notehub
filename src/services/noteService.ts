import axios from "axios";
import type { Note, NoteTag } from "../types/note";

// Створюємо екземпляр axios з базовими налаштуваннями для API.
const apiClient = axios.create({
    baseURL: "https://notehub-public.goit.study/api",
});

// Встановлюємо заголовок Authorization для всіх запитів.
// Токен доступу береться зі змінних оточення Vite.
apiClient.interceptors.request.use((config) => {
    const token = import.meta.env.VITE_NOTEHUB_TOKEN;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Інтерфейс для відповіді від API при запиті списку нотаток.
export interface FetchNotesResponse {
    notes: Note[];
    totalPages: number;
    currentPage: number;
    totalNotes: number;
}

// Інтерфейс для параметрів функції fetchNotes.
interface FetchNotesParams {
    page?: number;
    query?: string;
}

// Інтерфейс для даних нової нотатки, що відправляються на сервер.
export interface NewNotePayload {
    title: string;
    content: string;
    tag: NoteTag;
}

/**
 * Функція для отримання списку нотаток з сервера.
 * @param {FetchNotesParams} params - Об'єкт з параметрами для пагінації та пошуку.
 * @returns {Promise<FetchNotesResponse>} - Проміс, що повертає дані нотаток та пагінації.
 */
export const fetchNotes = async ({
    page = 1,
    query = "",
}: FetchNotesParams): Promise<FetchNotesResponse> => {
    const params = new URLSearchParams({
        page: String(page),
        perPage: "12",
    });

    if (query) {
        params.append("search", query);
    }

    // Робимо запит і одразу повертаємо поле data з відповіді.
    const response = await apiClient.get<FetchNotesResponse>(
        `/notes?${params.toString()}`
    );
    return response.data;
};

/**
 * Функція для створення нової нотатки.
 * @param {NewNotePayload} noteData - Дані для нової нотатки.
 * @returns {Promise<Note>} - Проміс, що повертає створену нотатку.
 */
export const createNote = async (noteData: NewNotePayload): Promise<Note> => {
    const response = await apiClient.post<Note>("/notes", noteData);
    return response.data;
};

/**
 * Функція для видалення нотатки за її ID.
 * @param {string} noteId - Ідентифікатор нотатки для видалення.
 * @returns {Promise<Note>} - Проміс, що повертає дані видаленої нотатки.
 */
export const deleteNote = async (noteId: string): Promise<Note> => {
    const response = await apiClient.delete<Note>(`/notes/${noteId}`);
    return response.data;
};
