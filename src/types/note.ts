// Оголошуємо тип для тегів нотаток, щоб обмежити можливі значення.
export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

// Описуємо інтерфейс для однієї нотатки, який відповідає структурі даних з бекенду.
export interface Note {
    id: string;
    title: string;
    content: string;
    tag: NoteTag;
    createdAt: string;
    updatedAt: string;
}
