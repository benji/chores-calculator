import React, { useState, useRef, useEffect } from "react";
import Form from "react-bootstrap/Form";
import "./EditableCell.css";

function EditableCell(props) {
  const handleFromChange = e => {
    props.onChange(e.target.value);
  };

  const classNames = [props.extraClassName, props.isCentered ? "centered" : ""];

  const input = (
    <Form.Control
      type="text"
      placeholder={props.placeholder}
      value={props.value}
      onChange={handleFromChange}
      className={classNames}
    />
  );

  return props.isHeader === true ? <th>{input}</th> : <td>{input}</td>;
}

export default EditableCell;
