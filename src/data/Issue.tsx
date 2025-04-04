export enum IssueType {
  TASK = "task",
  BUG = "bug",
  STORY = "story",
}

export enum TaskStatus {
  BACKLOG = "backlog",
  SELECTED = "selected",
  IN_PROGRESS = "inprogress",
  DONE = "done",
}

export enum IssuePriority {
  P5 = "5",
  P4 = "4",
  P3 = "3",
  P2 = "2",
  P1 = "1",
}

export const IssueTypeCopy: Record<IssueType, string> = {
  [IssueType.TASK]: "Task",
  [IssueType.BUG]: "Bug",
  [IssueType.STORY]: "Story",
};

export const TaskStatusCopy: Record<TaskStatus, string> = {
  [TaskStatus.BACKLOG]: "Backlog",
  [TaskStatus.SELECTED]: "Selected for Development",
  [TaskStatus.IN_PROGRESS]: "In Progress",
  [TaskStatus.DONE]: "Done",
};

export const IssuePriorityCopy: Record<IssuePriority, string> = {
  [IssuePriority.P5]: "P5",
  [IssuePriority.P4]: "P4",
  [IssuePriority.P3]: "P3",
  [IssuePriority.P2]: "P2",
  [IssuePriority.P1]: "P1",
};
