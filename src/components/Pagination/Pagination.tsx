import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

// Інтерфейс для пропсів компонента Pagination.
interface PaginationProps {
    // Загальна кількість сторінок.
    pageCount: number;
    // Функція, що викликається при зміні сторінки.
    onPageChange: (selectedItem: { selected: number }) => void;
    // додамо керовану поточну сторінку (1-based з App)
    currentPage: number;
}

/**
 * Компонент для навігації по сторінках.
 * @param {PaginationProps} props - Пропси компонента.
 */
const Pagination = ({
    pageCount,
    onPageChange,
    currentPage,
}: PaginationProps) => {
    return (
        <ReactPaginate
            previousLabel={"←"}
            nextLabel={"→"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={onPageChange}
            forcePage={Math.max(0, (currentPage ?? 1) - 1)}
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
