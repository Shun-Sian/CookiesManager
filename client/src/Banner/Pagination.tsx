import React from 'react';
import '../Styles/pagination.css';

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const handlePageChange = (page) => {
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
};

export default Pagination;
