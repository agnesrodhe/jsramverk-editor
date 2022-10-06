import React from "react";

function DropDown({onChange, docs}) {
    return (
        <select data-testid="dropdown" className="saveBtn" onChange={onChange}>
            <option value="-99" key="0">Välj ett dokument</option>
            {docs.map((doc, index) => <option data-testid="select" value={index} key={index}>{doc.name}</option>)}
        </select>

    )
}
export default DropDown;