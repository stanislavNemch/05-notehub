import type { Note } from "../../types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "../../services/noteService";
import css from "./NoteList.module.css";

// Пропси: onDeleted — щоб батько (App) міг показати toast
interface NoteListProps {
    notes: Note[];
    onDeleted?: (note: Note) => void; // повідомити App про успіх
}

/**
 * Список нотаток з інтегрованим видаленням через TanStack Query.
 */
const NoteList = ({ notes, onDeleted }: NoteListProps) => {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: deleteNote,
        onSuccess: (data) => {
            // інвалідовуємо список після видалення
            queryClient.invalidateQueries({ queryKey: ["notes"] });
            // Сповіщаємо App про успіх (для toast)
            onDeleted?.(data);
        },
    });

    return (
        <ul className={css.list}>
            {/* унікальний ключ — id з бекенду */}
            {notes.map(({ id, title, content, tag }) => (
                <li key={id} className={css.listItem}>
                    <div>
                        <h2 className={css.title}>{title}</h2>
                        <p className={css.content}>{content}</p>
                    </div>
                    <div className={css.footer}>
                        <span className={css.tag}>{tag}</span>
                        <button
                            className={css.button}
                            onClick={() => deleteMutation.mutate(id)}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending
                                ? "Deleting..."
                                : "Delete"}
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default NoteList;
