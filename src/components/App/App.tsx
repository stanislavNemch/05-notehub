import { useEffect, useState } from "react";
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
    const [page, setPage] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [debouncedQuery] = useDebounce(searchQuery, 500);
    const queryClient = useQueryClient();

    const {
        data: notesData,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["notes", page, debouncedQuery],
        queryFn: () => fetchNotes({ page, query: debouncedQuery }),
    });

    const createNoteMutation = useMutation({
        mutationFn: createNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
            toast.success("Note created successfully!");
            closeModal();
        },
        onError: (err) => {
            toast.error(`Failed to create note: ${err.message}`);
        },
    });

    const deleteNoteMutation = useMutation({
        mutationFn: deleteNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
            toast.success("Note deleted successfully!");
        },
        onError: (err) => {
            toast.error(`Failed to delete note: ${err.message}`);
        },
    });

    // Обробник видалення нотатки.
    const handleDeleteNote = (noteId: string) => {
        deleteNoteMutation.mutate(noteId);
    };

    // Скидаємо сторінку при зміні пошуку, щоб уникнути невідповідностей
    useEffect(() => {
        setPage(1);
    }, [debouncedQuery]);

    const handlePageClick = (event: { selected: number }): void => {
        setPage(event.selected + 1); // backend 1-based
    };

    const openModal = (): void => setIsModalOpen(true);
    const closeModal = (): void => setIsModalOpen(false);

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
                        currentPage={page}
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
                        // Ми передаємо нашу нову функцію-обгортку.
                        onDelete={handleDeleteNote}
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
