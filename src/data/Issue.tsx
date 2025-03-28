export enum IssueType {
  TASK = "task",
  BUG = "bug",
  STORY = "story",
}

export enum IssueStatus {
  BACKLOG = "backlog",
  SELECTED = "selected",
  INPROGRESS = "inprogress",
  DONE = "done",
}

export enum IssuePriority {
  HIGHEST = "5",
  HIGH = "4",
  MEDIUM = "3",
  LOW = "2",
  LOWEST = "1",
}

export const IssueTypeCopy: Record<IssueType, string> = {
  [IssueType.TASK]: "Task",
  [IssueType.BUG]: "Bug",
  [IssueType.STORY]: "Story",
};

export const IssueStatusCopy: Record<IssueStatus, string> = {
  [IssueStatus.BACKLOG]: "Backlog",
  [IssueStatus.SELECTED]: "Selected for development",
  [IssueStatus.INPROGRESS]: "In progress",
  [IssueStatus.DONE]: "Done",
};

export const IssuePriorityCopy: Record<IssuePriority, string> = {
  [IssuePriority.HIGHEST]: "Highest",
  [IssuePriority.HIGH]: "High",
  [IssuePriority.MEDIUM]: "Medium",
  [IssuePriority.LOW]: "Low",
  [IssuePriority.LOWEST]: "Lowest",
};
