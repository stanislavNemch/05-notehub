import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import toast from "react-hot-toast";
import {
    fetchNotes,
    createNote,
    deleteNote,
    type NewNotePayload,
} from "../../services/noteService";

import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

import css from "./App.module.css";

/**
 * Головний компонент програми.
 */
const App = () => {
    // Стан для поточної сторінки пагінації.
    const [page, setPage] = useState<number>(1);
    // Стан для пошукового запиту.
    const [searchQuery, setSearchQuery] = useState<string>("");
    // Стан для видимості модального вікна.
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    // Використовуємо useDebounce для затримки виконання пошукового запиту.
    const [debouncedQuery] = useDebounce(searchQuery, 500);

    // Отримуємо клієнт TanStack Query для інвалідації кешу.
    const queryClient = useQueryClient();

    // Запит на отримання нотаток за допомогою useQuery.
    // Ключ запиту містить сторінку та пошуковий запит, щоб кеш оновлювався при їх зміні.
    const {
        data: notesData,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["notes", page, debouncedQuery],
        queryFn: () => fetchNotes({ page, query: debouncedQuery }),
    });

    // Мутація для створення нової нотатки.
    const createNoteMutation = useMutation({
        mutationFn: createNote,
        onSuccess: () => {
            // При успішному створенні, інвалідуємо кеш нотаток, щоб отримати оновлений список.
            queryClient.invalidateQueries({ queryKey: ["notes"] });
            toast.success("Note created successfully!");
            closeModal(); // Закриваємо модальне вікно.
        },
        onError: (err) => {
            toast.error(`Failed to create note: ${err.message}`);
        },
    });

    // Мутація для видалення нотатки.
    const deleteNoteMutation = useMutation({
        mutationFn: deleteNote,
        onSuccess: () => {
            // При успішному видаленні, інвалідуємо кеш.
            queryClient.invalidateQueries({ queryKey: ["notes"] });
            toast.success("Note deleted successfully!");
        },
        onError: (err) => {
            toast.error(`Failed to delete note: ${err.message}`);
        },
    });

    // Обробник для зміни сторінки пагінації.
    const handlePageClick = (event: { selected: number }): void => {
        setPage(event.selected + 1);
    };

    // Обробники для відкриття та закриття модального вікна.
    const openModal = (): void => setIsModalOpen(true);
    const closeModal = (): void => setIsModalOpen(false);

    // Обробник для сабміту форми створення нотатки.
    const handleCreateNote = (values: NewNotePayload): void => {
        createNoteMutation.mutate(values);
    };

    return (
        <div className={css.app}>
            <header className={css.toolbar}>
                <SearchBox value={searchQuery} onChange={setSearchQuery} />
                {notesData && notesData.totalPages > 1 && (
                    <Pagination
                        pageCount={notesData.totalPages}
                        onPageChange={handlePageClick}
                    />
                )}
                <button className={css.button} onClick={openModal}>
                    Create note +
                </button>
            </header>

            <main>
                {isLoading && <Loader />}
                {isError && <ErrorMessage message={error?.message} />}
                {notesData && notesData.notes.length > 0 && (
                    <NoteList
                        notes={notesData.notes}
                        onDelete={deleteNoteMutation.mutate}
                    />
                )}
            </main>

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <NoteForm
                    onSubmit={handleCreateNote}
                    onCancel={closeModal}
                    isSubmitting={createNoteMutation.isPending}
                />
            </Modal>
        </div>
    );
};

export default App;
