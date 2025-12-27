import React, { useState } from 'react';
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

export default function DeleteUser({id, fetchData}) {
    const [showDelete, setShowDelete] = useState(false);

    const handleClose = () => setShowDelete(false);
    const handleShow = () => setShowDelete(true);

    // Success Dialog State 
    const [showSuccess, setShowSuccess] = useState(false);

    // Error Dialog State
    const [showError, setShowError] = useState(false);

    const deleteUser = async (id) => {
        try {
            await axios.delete(`/api/users/${id}`);

            // Hide modal on submisson 
            setShowDelete(false);

            // Success popup
            setShowSuccess(true);

            //Refresh list
            fetchData();
        } catch (e) {
            setShowDelete(false);
            setShowError(true);
            console.error(e);
        }
    };

    const deleteUserModal = (
        <Modal show={showDelete} backdrop="static" onHide={handleClose}>
            <Modal.Header closeButton style={{backgroundColor:"#fff"}}>
                <Modal.Title>Delete User</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{backgroundColor:"#fff"}}>
                ⚠️ Are you sure you want to permanently delete this user?
                <br/>
                <strong>This action caanot be undone.</strong> 
            </Modal.Body>
            <Modal.Footer style={{backgroundColor:"#fff"}}>
                <Button variant="outline-dark" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant='danger' onClick={() => deleteUser(id)}>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    );

    const successAlert = (
        <Modal
            show={showSuccess}
            onHide={() => setShowSuccess(false)}
            backdrop="static"
        >
            <Modal.Header
                closeButton
                style={{backgroundColor:"#00E676"}}
            >
                Success!
            </Modal.Header>
            <Modal.Body style={{backgroundColor:"#fff"}}>
                User was successfully deleted.
            </Modal.Body>
        </Modal>
    );

    const errorAlert = (
        <Modal
            show={showError}
            onHide={() => setShowError(false)}
            backdrop="static"
        >
            <Modal.Header
                closeButton
                style={{backgroundColor:"#FF1744"}}
            >
                Error!
            </Modal.Header>
            <Modal.Body style={{backgroundColor:"#fff"}}>
                There was an error deleting the user.
            </Modal.Body>
        </Modal>
    );

    return (
        <>
            <button
                className='btn btn-danger extraInfoButton'
                onClick={handleShow}
            >
                Delete
            </button>

            {deleteUserModal}
            {successAlert}
            {errorAlert}
        </>
    );
}