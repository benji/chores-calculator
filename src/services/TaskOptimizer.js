const self = {};

/**
 * TaskAssignment:
 * TaskIdx -> ParticipantIdx
 */

self.assignTasks = context => {
  const globalContext = {
    ...context,
    costs: self.normalizeCosts(context.costs),
    bestTaskAssignment: null,
    bestTaskAssignmentScore: null
  };
  const iterationContext = {
    currentTaskAssignment: {},
    currentTaskAssignmentScore: 0
  };
  self.assignTasksRecursive(globalContext, iterationContext, 0);

  const scores = [];

  console.log("Finished optimizing", globalContext.bestTaskAssignment);
  for (var pId = 0; pId < globalContext.participants.length; pId++) {
    scores[pId] = self.computeScoreForParticipant(
      globalContext,
      globalContext.bestTaskAssignment,
      pId
    );
    console.log("Participant", pId, scores[pId]);
  }
  return {
    assignment: globalContext.bestTaskAssignment,
    scores
  };
};

self.normalizeCosts = costs => {
  const newCosts = [];
  console.log("normalizing", costs);
  for (
    var participantIdx = 0;
    participantIdx < costs.length;
    participantIdx++
  ) {
    var total = 0;
    for (var taskId = 0; taskId < costs[participantIdx].length; taskId++) {
      total += self.getCostAsFloat(costs, participantIdx, taskId, 0);
    }
    newCosts[participantIdx] = [];
    for (var taskId = 0; taskId < costs[participantIdx].length; taskId++) {
      newCosts[participantIdx][taskId] =
        total === 0
          ? 0
          : (self.getCostAsFloat(costs, participantIdx, taskId, 0) * 1.0) /
            total;
    }
  }
  return newCosts;
};

self.getCost = (costs, participantIdx, taskIdx, defaultValue) => {
  if (!(participantIdx in costs)) return defaultValue;
  const participantCost = costs[participantIdx];
  if (!(taskIdx in participantCost)) return defaultValue;
  return participantCost[taskIdx];
};

self.getCostAsFloat = (costs, participantIdx, taskIdx, defaultValue) => {
  const cost = parseFloat(
    self.getCost(costs, participantIdx, taskIdx, defaultValue)
  );
  if (isNaN(cost)) {
    console.log("!!! Invalid cost", cost);
    return defaultValue;
  }
  return cost;
};

self.computeScoreForParticipant = (context, taskAssignment, participantIdx) => {
  var participantScore = 0;
  for (var taskIdx in taskAssignment) {
    if (taskAssignment[taskIdx] === participantIdx) {
      participantScore += self.getCostAsFloat(
        context.costs,
        participantIdx,
        taskIdx,
        0
      );
    }
  }
  return participantScore;
};

self.assignTasksRecursive = (globalContext, iterationContext, taskIdx) => {
  if (taskIdx >= globalContext.tasks.length) {
    console.log(
      "Assessment complete:",
      iterationContext.currentTaskAssignment,
      iterationContext.currentTaskAssignmentScore
    );
    if (
      globalContext.bestTaskAssignmentScore === null ||
      iterationContext.currentTaskAssignmentScore <
        globalContext.bestTaskAssignmentScore
    ) {
      console.log("Found better!", globalContext.bestTaskAssignmentScore);
      globalContext.bestTaskAssignmentScore =
        iterationContext.currentTaskAssignmentScore;
      globalContext.bestTaskAssignment = iterationContext.currentTaskAssignment;
    }
    return;
  }

  for (
    var participantIdx = 0;
    participantIdx < globalContext.participants.length;
    participantIdx++
  ) {
    console.log(
      "participantIdx",
      taskIdx,
      participantIdx,
      iterationContext.currentTaskAssignment
    );
    const newAssignment = {
      ...iterationContext.currentTaskAssignment
    };
    newAssignment[taskIdx] = participantIdx;

    const newScoreForParticipant = self.computeScoreForParticipant(
      globalContext,
      newAssignment,
      participantIdx
    );

    if (
      // optimization
      globalContext.bestTaskAssignment !== null &&
      newScoreForParticipant >= globalContext.bestTaskAssignmentScore
    ) {
      console.log(
        "Won't continue",
        newScoreForParticipant,
        globalContext.bestTaskAssignmentScore
      );
      continue;
    }

    var newIterationContext = {
      currentTaskAssignment: newAssignment,
      currentTaskAssignmentScore: Math.max(
        newScoreForParticipant,
        iterationContext.currentTaskAssignmentScore
      )
    };

    self.assignTasksRecursive(globalContext, newIterationContext, taskIdx + 1);
  }
};

export default self;
