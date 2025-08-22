import type { Note } from "../../types/note";
import css from "./NoteList.module.css";

// Інтерфейс для пропсів компонента NoteList.
interface NoteListProps {
    // Масив нотаток для відображення.
    notes: Note[];
    // Функція для обробки видалення нотатки.
    onDelete: (noteId: string) => void;
}

/**
 * Компонент для відображення списку нотаток.
 * @param {NoteListProps} props - Пропси компонента.
 */
const NoteList = ({ notes, onDelete }: NoteListProps) => {
    return (
        <ul className={css.list}>
            {/* Перебираємо масив нотаток. Деструктуруємо id з кожного об'єкта note.*/}
            {notes.map(({ id, title, content, tag }) => (
                <li key={id} className={css.listItem}>
                    <div>
                        <h2 className={css.title}>{title}</h2>
                        <p className={css.content}>{content}</p>
                    </div>
                    <div className={css.footer}>
                        <span className={css.tag}>{tag}</span>
                        {/* Викликаємо onDelete з id конкретної нотатки під час кліку */}
                        <button
                            className={css.button}
                            onClick={() => onDelete(id)}
                        >
                            Delete
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default NoteList;
