import React, { useEffect, useState } from "react";

export const HandleFieldInputDate = ({
    setRootState,
    rootState,
}) => {
    const [createDate, setCreateDate] = useState(rootState?.createDate);


    const handleFieldInputDate = (event) => {
        var stateObj = {};
        if (event.target.id.indexOf(".") > -1) {
            let level1Obj = event.target.id.split(".")[0];
            let level2Obj = event.target.id.split(".")[1];

            let nestedProperty = { ...this.state[level1Obj] };
            nestedProperty[level2Obj] = event.target.value;
            stateObj[level1Obj] = nestedProperty;
        } else {
            stateObj[event.target.id] = event.target.value.concat(':00.000Z');
        }
        setCreateDate(stateObj);
    };

    useEffect(() => {
        setRootState(createDate);
    }, [createDate]
    )

    return (
        <div className="form-group logInInputField">
            <label className="control-label">
                Create Date
            </label>{" "}
            <input
                onChange={handleFieldInputDate}
                id="createDate"
                value={rootState.createDate.slice(0, -8)}
                className="form-control hide-on-print"
                type="datetime-local"
            />{" "}
        </div>
    )
}


