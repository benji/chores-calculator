import React, { useState, useRef, useEffect } from "react";
import EditableCell from "./EditableCell";
import Table from "react-bootstrap/Table";
import "./Chores.css";
import TaskOptimizer from "../services/TaskOptimizer";

function Chores(props) {
  const [participants, setParticipants] = useState([
    { name: "Benjamin" },
    { name: "Sepideh" }
  ]);

  const [tasks, setTasks] = useState([
    { name: "Vaccum" },
    { name: "Dishes" },
    { name: "Keep kitchen clean" },
    { name: "Laundry" },
    { name: "Washing bathroom" },
    { name: "Take out trash" }
  ]);

  const [costs, setCosts] = useState([
    [100, 100, 80, 20, 70, 10],
    [5, 3, 6, 2, 7, 2]
  ]);

  const [scores, setScores] = useState([]);

  const [assignments, setAssignments] = useState({});

  useEffect(() => {
    recomputeTaskAssignments();
  }, []); //only once

  const updateParticipantName = participantIndex => name => {
    const newParticipants = [...participants]; // copy
    newParticipants[participantIndex].name = name;
    setParticipants(newParticipants);
  };

  const updateTaskName = taskIndex => name => {
    const newTasks = [...tasks]; // copy
    newTasks[taskIndex].name = name;
    setParticipants(newTasks);
  };

  const updateCost = (participantIdx, taskIdx) => cost => {
    const newCosts = [...costs]; //copy
    if (!(participantIdx in newCosts)) newCosts[participantIdx] = [];
    newCosts[participantIdx][taskIdx] = cost;
    setCosts(newCosts);
    recomputeTaskAssignments();
  };

  const recomputeTaskAssignments = () => {
    const result = TaskOptimizer.assignTasks({
      participants,
      tasks,
      costs
    });
    setAssignments(result.assignment);
    setScores(result.scores);
  };

  const isAssigned = (participantIdx, taskIdx) => {
    return assignments && assignments[taskIdx] === participantIdx;
  };

  const participantHeaders = participants.map((p, idx) => (
    <EditableCell
      value={p.name}
      onChange={updateParticipantName(idx)}
      isHeader="true"
      isCentered="true"
    />
  ));

  const tableContent = tasks.map((t, taskIdx) => (
    <tr>
      <EditableCell value={t.name} onChange={updateTaskName(taskIdx)} />
      {participants.map((p, participantIdx) => (
        <EditableCell
          value={TaskOptimizer.getCost(costs, participantIdx, taskIdx, "")}
          isCentered="true"
          onChange={updateCost(participantIdx, taskIdx)}
          placeholder="0"
          extraClassName={isAssigned(participantIdx, taskIdx) ? "assigned" : ""}
        />
      ))}
    </tr>
  ));

  const scoresContent = scores.map(s => (
    <EditableCell value={parseInt(s * 100)} placeholder="-" isCentered="true" />
  ));

  return (
    <div>
      <Table striped bordered hover responsive="lg">
        <thead>
          <tr>
            <th></th>
            {participantHeaders}
          </tr>
          {tableContent}
          <tr>
            <EditableCell value="(Scores)" placeholder="-" />
            {scoresContent}
          </tr>
        </thead>
      </Table>
    </div>
  );
}

export default Chores;
