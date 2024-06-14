import React, { useState } from 'react';
import "./MessageBoard.css";
import "../../App.css";

const Pagination = ({
    nextPageMessage,
    recentPageMessage,
    prevPageMessage,
    currentPage,
}) => {

    const recentPage = () => {
        currentPage = 1;
        recentPageMessage();
    }

    const nextPage = () => {
        currentPage += 1;
        nextPageMessage();
    }

    const prevPage = () => {
        currentPage -= 1;
        prevPageMessage();
    }

    return (
        <ul id='pagination' className="pagination">

            <li className="page-item">
                <a
                    onClick={() => recentPage()}
                    className= {currentPage === 1 ? 'btn btn-light page-link disabled' : 'btn btn-light page-link'}
                    id={'recentPageBtn'}
                >
                    Recent
                </a>
            </li>

            <li className="page-item">
                <a
                    onClick={() => prevPage()}
                    className= {currentPage === 1 ? 'btn btn-light page-link disabled' : 'btn btn-light page-link'}
                    id={'prevPageBtn'}
                >
                    &larr;
                </a>
            </li>

            <li className="page-item">
                <a
                    onClick={() => nextPage()}
                    className='btn btn-light page-link'
                    id={'nextPageBtn'}
                >
                    &rarr;
                </a>
            </li>
        </ul>
    )
}
export default Pagination