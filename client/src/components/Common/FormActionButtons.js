import React from "react";

const FormActionButtons = ({ 
  onPrint, 
  onDelete, 
  showDelete = false,
  printLabel = "Print",
  deleteLabel = "Delete Form",
  className = ""
}) => {
  return (
    <div className={`hide-on-print ${className}`}>
      <button
        onClick={onPrint}
        className="mr-3 btn btn-light hide-on-print"
      >
        {printLabel} <i className="fas fa-print"></i>
      </button>
      {showDelete && (
        <button
          onClick={onDelete}
          className="btn btn-light hide-on-print"
        >
          {deleteLabel} <i className="fas fa-trash"></i>
        </button>
      )}
    </div>
  );
};

export default FormActionButtons;