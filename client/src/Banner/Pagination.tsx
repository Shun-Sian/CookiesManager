import React from 'react';
import type { PaginationProps } from '../types/Pagination.types';
import '../Styles/pagination.css';

export default function Pagination(props: PaginationProps) {
  const { totalPages, currentPage, onPageChange } = props;
  const handlePageChange = (page: number) => {
    if (page < 0 || page >= totalPages) return;
    onPageChange(page);
  };

  return (
    <div className="pagination">
      <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>
        Previous
      </button>
      <span>
        Page {currentPage + 1} of {totalPages}
      </span>
      <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages - 1}>
        Next
      </button>
    </div>
  );
}
