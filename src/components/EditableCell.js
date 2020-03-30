import React, { useState, useRef, useEffect } from "react";
import Form from "react-bootstrap/Form";
import "./EditableCell.css";

function EditableCell(props) {
  const handleFromChange = e => {
    props.onChange(e.target.value);
  };

  const classNames = [props.extraClassName, props.isCentered ? "centered" : ""];

  const backgroundContent = props.backgroundText ? (
    <div class="background-text">{props.backgroundText}</div>
  ) : (
    <></>
  );

  const cellContent = (
    <>
      <Form.Control
        type="text"
        placeholder={props.placeholder}
        value={props.value}
        onChange={handleFromChange}
        className={classNames}
      />

      {backgroundContent}
    </>
  );

  return props.isHeader === true ? (
    <th>{cellContent}</th>
  ) : (
    <td>{cellContent}</td>
  );
}

export default EditableCell;
