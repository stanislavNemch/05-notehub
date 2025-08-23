import { useEffect, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query"; // для плавної пагінації
import { useDebounce } from "use-debounce";
import toast from "react-hot-toast";
import { fetchNotes } from "../../services/noteService";

import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

import css from "./App.module.css";

/**
 * Головний компонент застосунку.
 * - toast показуємо тут (у батька) при успішних створенні/видаленні.
 * - Loader показуємо лише при початковому завантаженні (без isFetching), щоб не миготів.
 * - Плавна пагінація через placeholderData: keepPreviousData.
 */
const App = () => {
    const [page, setPage] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [debouncedQuery] = useDebounce(searchQuery, 500);

    // Скидаємо сторінку при зміні пошуку
    useEffect(() => {
        setPage(1);
    }, [debouncedQuery]);

    const {
        data: notesData,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["notes", page, debouncedQuery],
        queryFn: () => fetchNotes({ page, query: debouncedQuery }),
        placeholderData: keepPreviousData, // плавна пагінація без миготіння
    });

    const handlePageClick = (event: { selected: number }): void => {
        setPage(event.selected + 1);
    };

    const openModal = (): void => setIsModalOpen(true);
    const closeModal = (): void => setIsModalOpen(false);

    // Колбеки успіху для дочірніх компонентів — тут показуємо toast
    const handleCreated = () => {
        toast.success("Note created successfully!");
    };
    const handleDeleted = () => {
        toast.success("Note deleted successfully!");
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
                {/* Loader тільки при первинному завантаженні, без isFetching */}
                {isLoading && <Loader />}
                {isError && <ErrorMessage message={error?.message} />}
                {notesData && notesData.notes.length > 0 && (
                    <NoteList
                        notes={notesData.notes}
                        onDeleted={handleDeleted}
                    />
                )}
            </main>

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <NoteForm onCancel={closeModal} onCreated={handleCreated} />
            </Modal>
        </div>
    );
};

export default App;
