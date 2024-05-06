import React, { useState } from 'react';
import "./MessageBoard.css";
import "../../App.css";

const Pagination = ({
    postsPerPage,
    length,
    handlePagination,
    currentPage,
}) => {
    let pageButtonCount = 5;
    let pageButtonTotal = length / postsPerPage;
    let [startIndex, setStartIndex] = useState(0);
    let [endIndex, setEndIndex] = useState(pageButtonCount);

    let paginationNumber = [];
    const nextPage = () => {
        setStartIndex(startIndex += pageButtonCount);
        setEndIndex(endIndex += pageButtonCount);
        document.getElementById("prevPageBtn").classList.remove('disabled');
        pageButtonTotal<endIndex && document.getElementById("nextPageBtn").classList.add('disabled');
    }
    const prevPage = () => {
        setStartIndex(startIndex -= pageButtonCount);
        setEndIndex(endIndex -= pageButtonCount);
        document.getElementById("nextPageBtn").classList.remove('disabled');
        startIndex === 0 && document.getElementById("prevPageBtn").classList.add('disabled')
    }

    for (let i = 1; i <= Math.ceil(length / postsPerPage); i++) {
        if (i <= endIndex && i > startIndex) {
            paginationNumber.push(i)
        }
    }


    return (
        <ul id='pagination' className="pagination">
                <li className="page-item">
                    <a
                        onClick={() => prevPage()}
                        className={'btn btn-light page-link disabled'}
                        id={'prevPageBtn'}
                    >
                        &larr;
                    </a>
                </li>
            {paginationNumber.map((data) => (
                <li className="page-item">
                    <a
                        key={data}
                        onClick={() => handlePagination(data)}
                        className={currentPage === data ? 'active btn page-link' : 'btn btn-light page-link'}
                    >
                        {data}
                    </a>
                </li>
            ))
            }
                <li className="page-item">
                    <a
                        onClick={() => nextPage()}
                        className={pageButtonTotal <= pageButtonCount ? 'btn btn-light page-link disabled' : 'btn btn-light page-link'}
                        id={'nextPageBtn'}
                    >
                        &rarr;
                    </a>
                </li>
        </ul>
    )
}
export default Pagination