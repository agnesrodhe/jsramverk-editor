import React from "react";

function DropDown(props) {
    return (
        <select data-testid="dropdown" className="saveBtn" onChange={props.onChange}>
            <option value="-99" key="0">Välj ett dokument</option>
            {props.docs.map((doc, index) => <option data-testid="select" value={index} key={index}>{doc.name}</option>)}
        </select>
    )
}
export default DropDown;