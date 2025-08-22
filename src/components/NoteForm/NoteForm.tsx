import {
    Formik,
    Form,
    Field,
    ErrorMessage as FormikErrorMessage,
} from "formik";
import * as Yup from "yup";
import css from "./NoteForm.module.css";
import type { NewNotePayload } from "../../services/noteService";
import type { NoteTag } from "../../types/note";

// Схема валідації для форми за допомогою Yup.
const validationSchema = Yup.object({
    title: Yup.string()
        .min(3, "Title must be at least 3 characters")
        .max(50, "Title must be at most 50 characters")
        .required("Title is required"),
    content: Yup.string().max(500, "Content must be at most 500 characters"),
    tag: Yup.mixed<NoteTag>()
        .oneOf(
            ["Todo", "Work", "Personal", "Meeting", "Shopping"],
            "Invalid tag value"
        )
        .required("Tag is required"),
});

// Початкові значення для полів форми.
const initialValues: NewNotePayload = {
    title: "",
    content: "",
    tag: "Todo",
};

// Інтерфейс для пропсів компонента NoteForm.
interface NoteFormProps {
    // Функція, що викликається при сабміті форми.
    onSubmit: (values: NewNotePayload) => void;
    // Функція для скасування та закриття форми.
    onCancel: () => void;
    // Прапорець, що вказує, чи триває процес відправки форми.
    isSubmitting: boolean;
}

/**
 * Компонент форми для створення нової нотатки.
 * @param {NoteFormProps} props - Пропси компонента.
 */
const NoteForm = ({ onSubmit, onCancel, isSubmitting }: NoteFormProps) => {
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, actions) => {
                onSubmit(values);
                actions.resetForm();
            }}
        >
            {({ isValid }) => (
                <Form className={css.form}>
                    <div className={css.formGroup}>
                        <label htmlFor="title">Title</label>
                        <Field
                            id="title"
                            type="text"
                            name="title"
                            className={css.input}
                        />
                        <FormikErrorMessage
                            name="title"
                            component="span"
                            className={css.error}
                        />
                    </div>

                    <div className={css.formGroup}>
                        <label htmlFor="content">Content</label>
                        <Field
                            id="content"
                            as="textarea"
                            name="content"
                            rows={8}
                            className={css.textarea}
                        />
                        <FormikErrorMessage
                            name="content"
                            component="span"
                            className={css.error}
                        />
                    </div>

                    <div className={css.formGroup}>
                        <label htmlFor="tag">Tag</label>
                        <Field
                            id="tag"
                            as="select"
                            name="tag"
                            className={css.select}
                        >
                            <option value="Todo">Todo</option>
                            <option value="Work">Work</option>
                            <option value="Personal">Personal</option>
                            <option value="Meeting">Meeting</option>
                            <option value="Shopping">Shopping</option>
                        </Field>
                        <FormikErrorMessage
                            name="tag"
                            component="span"
                            className={css.error}
                        />
                    </div>

                    <div className={css.actions}>
                        <button
                            type="button"
                            className={css.cancelButton}
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={css.submitButton}
                            disabled={!isValid || isSubmitting}
                        >
                            {isSubmitting ? "Creating..." : "Create note"}
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default NoteForm;
