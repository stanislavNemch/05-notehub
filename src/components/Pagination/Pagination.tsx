import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

// Інтерфейс для пропсів компонента Pagination.
interface PaginationProps {
    // Загальна кількість сторінок.
    pageCount: number;
    // Функція, що викликається при зміні сторінки.
    onPageChange: (selectedItem: { selected: number }) => void;
}

/**
 * Компонент для навігації по сторінках.
 * @param {PaginationProps} props - Пропси компонента.
 */
const Pagination = ({ pageCount, onPageChange }: PaginationProps) => {
    return (
        <ReactPaginate
            previousLabel={"←"}
            nextLabel={"→"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={onPageChange}
            containerClassName={css.pagination}
            activeClassName={css.active}
            pageLinkClassName={css.pageLink}
            previousLinkClassName={css.pageLink}
            nextLinkClassName={css.pageLink}
            breakLinkClassName={css.pageLink}
        />
    );
};

export default Pagination;
