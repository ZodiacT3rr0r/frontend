import {
  Dispatch,
  SetStateAction,
  useState,
  DragEvent,
  FormEvent,
  useEffect,
} from "react";
import { FiPlus, FiTrash } from "react-icons/fi";
import { motion } from "framer-motion";
import { FaFire } from "react-icons/fa";
import {
  TaskType,
  TaskWorkflowStatus,
  TaskPriority,
  TaskSeverity,
  Task,
} from "../data/Types";
import {
  mockTasks,
  addTask,
  saveAllData,
  updateTask,
  deleteTask,
} from "../data/mockdata";

// Type mapping between Task status and Kanban columns
const statusToColumn = (status: TaskWorkflowStatus): ColumnType => {
  switch (status) {
    case TaskWorkflowStatus.BACKLOG:
      return "backlog";
    case TaskWorkflowStatus.SELECTED:
      return "todo";
    case TaskWorkflowStatus.IN_PROGRESS:
      return "doing";
    case TaskWorkflowStatus.DONE:
      return "done";
    default:
      return "backlog";
  }
};

// Map from column back to TaskWorkflowStatus
const columnToStatus = (column: ColumnType): TaskWorkflowStatus => {
  switch (column) {
    case "backlog":
      return TaskWorkflowStatus.BACKLOG;
    case "todo":
      return TaskWorkflowStatus.SELECTED;
    case "doing":
      return TaskWorkflowStatus.IN_PROGRESS;
    case "done":
      return TaskWorkflowStatus.DONE;
  }
};

// Convert a Task to CardType
const taskToCard = (task: Task): CardType => {
  return {
    id: task.id,
    title: task.problem_statement,
    column: statusToColumn(task.status),
    type: task.type,
    status: task.status,
    priority: task.priority,
    severity: task.severity,
  };
};

export const CustomKanban = () => {
  return (
    <div className="h-screen w-full bg-neutral-900 text-neutral-50">
      <Board />
    </div>
  );
};

const updateBackend = (updatedCards: CardType[]) => {
  fetch(`http://localhost:3000/cards`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedCards),
  });
};

const Board = () => {
  const [cards, setCards] = useState<CardType[]>([]);

  useEffect(() => {
    // Check for and filter out duplicate tasks
    const taskIds = new Set<string>();
    const uniqueTasks: Task[] = [];

    mockTasks.forEach((task) => {
      if (!taskIds.has(task.id)) {
        taskIds.add(task.id);
        uniqueTasks.push(task);
      } else {
        console.warn(
          `Skipping duplicate task with ID: ${task.id} in Kanban view`
        );
      }
    });

    // Convert unique tasks to card format
    const initialCards = uniqueTasks.map(taskToCard);
    setCards(initialCards);
    console.log(
      "Loaded",
      initialCards.length,
      "unique tasks out of",
      mockTasks.length,
      "total tasks"
    );
  }, []);

  return (
    <div className="flex h-full w-full gap-3 overflow-scroll p-12">
      <Column
        title="Backlog"
        column="backlog"
        headingColor="text-neutral-500"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="TODO"
        column="todo"
        headingColor="text-yellow-200"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="In progress"
        column="doing"
        headingColor="text-blue-200"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="Complete"
        column="done"
        headingColor="text-emerald-200"
        cards={cards}
        setCards={setCards}
      />
      <BurnBarrel setCards={setCards} />
    </div>
  );
};

type ColumnProps = {
  title: string;
  headingColor: string;
  cards: CardType[];
  column: ColumnType;
  setCards: Dispatch<SetStateAction<CardType[]>>;
};

const Column = ({
  title,
  headingColor,
  cards,
  column,
  setCards,
}: ColumnProps) => {
  const [active, setActive] = useState(false);

  const handleDragStart = (e: DragEvent, card: CardType) => {
    e.dataTransfer.setData("cardId", card.id);
  };

  const handleDragEnd = (e: DragEvent) => {
    const cardId = e.dataTransfer.getData("cardId");

    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = element.dataset.before || "-1";

    if (before !== cardId) {
      let copy = [...cards];

      let cardToTransfer = copy.find((c) => c.id === cardId);
      if (!cardToTransfer) return;

      // Update the column (and corresponding status)
      const oldColumn = cardToTransfer.column;
      cardToTransfer = { ...cardToTransfer, column };

      // Update the actual task status in mockTasks when column changes
      if (oldColumn !== column) {
        const newStatus = columnToStatus(column);
        // Use updateTask instead of direct modification
        updateTask(cardId, { status: newStatus });
        console.log(`Updated task ${cardId} status to ${newStatus}`);
      }

      copy = copy.filter((c) => c.id !== cardId);

      const moveToBack = before === "-1";

      if (moveToBack) {
        copy.push(cardToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el) => el.id === before);
        if (insertAtIndex === -1) return;

        copy.splice(insertAtIndex, 0, cardToTransfer);
      }

      setCards(copy);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    highlightIndicator(e);

    setActive(true);
  };

  const clearHighlights = (els?: HTMLElement[]) => {
    const indicators = els || getIndicators();

    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const highlightIndicator = (e: DragEvent) => {
    const indicators = getIndicators();

    clearHighlights(indicators);

    const el = getNearestIndicator(e, indicators);

    el.element.style.opacity = "1";
  };

  const getNearestIndicator = (e: DragEvent, indicators: HTMLElement[]) => {
    const DISTANCE_OFFSET = 50;

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();

        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );

    return el;
  };

  const getIndicators = () => {
    return Array.from(
      document.querySelectorAll(
        `[data-column="${column}"]`
      ) as unknown as HTMLElement[]
    );
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  const filteredCards = cards.filter((c) => c.column === column);

  return (
    <div className="w-56 shrink-0">
      <div className="mb-3 flex items-center justify-start gap-4">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="rounded text-neutral-400">{filteredCards.length}</span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full transition-colors ${
          active ? "bg-neutral-800/50" : "bg-neutral-800/0"
        }`}
      >
        {filteredCards.map((c) => {
          return <Card key={c.id} {...c} handleDragStart={handleDragStart} />;
        })}
        <DropIndicator beforeId={null} column={column} />
        <AddCard column={column} setCards={setCards} />
      </div>
    </div>
  );
};

type CardProps = CardType & {
  handleDragStart: Function;
};

const Card = ({
  title,
  id,
  column,
  type,
  status,
  priority,
  severity,
  handleDragStart,
}: CardProps) => {
  return (
    <>
      <DropIndicator beforeId={id} column={column} />
      <motion.div
        layout
        layoutId={id}
        draggable="true"
        onDragStart={(e) =>
          handleDragStart(e, {
            title,
            id,
            column,
            type,
            status,
            priority,
            severity,
          })
        }
        className="cursor-grab rounded border border-neutral-700 bg-neutral-800 p-3 active:cursor-grabbing"
      >
        <p className="text-sm font-semibold text-neutral-100">{title}</p>
        <div className="mt-2 flex flex-col gap-1 text-xs text-neutral-400">
          <span>🧩 {type}</span>
          <span>🚦 {status}</span>
          <span>⚡ {priority}</span>
          <span>🔥 {severity}</span>
        </div>
      </motion.div>
    </>
  );
};

type DropIndicatorProps = {
  beforeId: string | null;
  column: string;
};

const DropIndicator = ({ beforeId, column }: DropIndicatorProps) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
    />
  );
};

const BurnBarrel = ({
  setCards,
}: {
  setCards: Dispatch<SetStateAction<CardType[]>>;
}) => {
  const [active, setActive] = useState(false);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDragEnd = (e: DragEvent) => {
    const cardId = e.dataTransfer.getData("cardId");

    // Use deleteTask instead of direct modification
    deleteTask(cardId);
    console.log(`Deleted task ${cardId}`);

    setCards((prev) => prev.filter((c) => c.id !== cardId));
    setActive(false);
  };

  return (
    <div
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`mt-10 grid h-56 w-56 shrink-0 place-content-center rounded border text-3xl ${
        active
          ? "border-red-800 bg-red-800/20 text-red-500"
          : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
      }`}
    >
      {active ? <FaFire className="animate-bounce" /> : <FiTrash />}
    </div>
  );
};

type AddCardProps = {
  column: ColumnType;
  setCards: Dispatch<SetStateAction<CardType[]>>;
};

const AddCard = ({ column, setCards }: AddCardProps) => {
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!text.trim().length) return;

    // Generate a new task ID
    const taskId = `TASK-${mockTasks.length + 1}`;

    // Map column to status
    const status = columnToStatus(column);

    // Create a new task in mockTasks using complete Task interface requirements
    const newTask: Task = {
      id: taskId,
      problem_statement: text.trim(),
      description: text.trim(),
      type: TaskType.TASK,
      status: status,
      priority: TaskPriority.P3,
      severity: TaskSeverity.MEDIUM,
      story_points: 3,
      estimated_hours: 4,
      actual_hours: 0,
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
      project:
        mockTasks.length > 0
          ? mockTasks[0].project
          : mockTasks[0]?.project || {
              id: "default-project",
              name: "Default Project",
              description: "Default project for new tasks",
              employees: [],
              tasks: [],
              sprints: [],
              deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              created_at: new Date(),
              updated_at: new Date(),
              required_action_privilege: {
                id: "1",
                name: "Admin",
                level: 1,
              } as any,
            },
      associated_files: [],
      pre_requisite_tasks: [],
      dependent_tasks: [],
      blocked: false,
      status_change_events: [],
      comments: [],
      files: [],
      created_at: new Date(),
      updated_at: new Date(),
      required_action_privilege:
        mockTasks.length > 0
          ? mockTasks[0].required_action_privilege
          : ({ id: "1", name: "TeamMember", level: 1 } as any),
    };

    // Add to mockTasks and store in localStorage
    const addedTask = addTask(newTask);
    console.log(`Created new task: ${addedTask.id}`);

    // Convert to card and add to UI
    const newCard = taskToCard(newTask);
    setCards((prev) => [...prev, newCard]);

    setText("");
    setAdding(false);
  };

  return (
    <>
      {adding ? (
        <motion.form layout onSubmit={handleSubmit}>
          <textarea
            onChange={(e) => setText(e.target.value)}
            autoFocus
            placeholder="Add new task..."
            className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm text-neutral-50 placeholder-violet-300 focus:outline-0"
          />
          <div className="mt-1.5 flex items-center justify-end gap-1.5">
            <button
              onClick={() => setAdding(false)}
              className="px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
            >
              Close
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded bg-neutral-50 px-3 py-1.5 text-xs text-neutral-950 transition-colors hover:bg-neutral-300"
            >
              <span>Add</span>
              <FiPlus />
            </button>
          </div>
        </motion.form>
      ) : (
        <motion.button
          layout
          onClick={() => setAdding(true)}
          className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
        >
          <span>Add card</span>
          <FiPlus />
        </motion.button>
      )}
    </>
  );
};

type ColumnType = "backlog" | "todo" | "doing" | "done";

type CardType = {
  id: string;
  title: string;
  column: ColumnType;
  type: TaskType;
  status: TaskWorkflowStatus;
  priority: TaskPriority;
  severity: TaskSeverity;
};
