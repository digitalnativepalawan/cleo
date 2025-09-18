// Default export for ProjectModule compatibility
export default {
  TasksView,
  LaborView,
  MaterialsView,
};
import React from "react";
import type {
  Task,
  Labor,
  Material,
  TaskStatus,
} from "../../../types/portal.ts";
import type { UserRole } from "../../../../components/Portal.tsx";

/* -------------------------------------------------------
   Small, local SVG icons (no external dependency)
-------------------------------------------------------- */

const LinkIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 13.5l3-3M8 16a4 4 0 010-8h3m5 0a4 4 0 010 8h-3"
    />
  </svg>
);

const ImagePlaceholderIcon: React.FC<{ className?: string }> = ({
  className,
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className={className}
  >
    <rect x="3" y="4" width="18" height="16" rx="2" strokeWidth="1.6" />
    <path d="M7 14l2.5-2.5L12 14l3.5-3.5L21 16" strokeWidth="1.6" />
    <circle cx="8" cy="8" r="1.2" fill="currentColor" />
  </svg>
);

const EditIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
    <path
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 20h4l10.5-10.5a1.5 1.5 0 000-2.12l-1.88-1.88a1.5 1.5 0 00-2.12 0L4 16v4z"
    />
  </svg>
);

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
    <path strokeWidth="1.8" strokeLinecap="round" d="M4 7h16" />
    <path
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7 7l1 13h8l1-13M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2"
    />
  </svg>
);

/* -------------------------------------------------------
   Helpers
-------------------------------------------------------- */

// Extract the first http/https URL from notes (we store: "Receipt: https://...")
const extractReceiptLink = (notes?: string): string | null => {
  if (!notes) return null;
  const m = notes.match(/https?:\/\/[^\s)]+/i);
  return m ? m[0] : null;
};

const Pill: React.FC<{ state: "paid" | "unpaid" }> = ({ state }) => (
  <span
    className={
      "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold " +
      (state === "paid"
        ? "bg-green-100 text-green-700"
        : "bg-rose-100 text-rose-700")
    }
  >
    {state === "paid" ? "Paid" : "Unpaid"}
  </span>
);

/* -------------------------------------------------------
   Types for view props
-------------------------------------------------------- */

type SortConfig<T> = { key: keyof T; direction: "ascending" | "descending" } | null;

type CommonProps<T> = {
  role: UserRole;
  sortConfig: SortConfig<T>;
  requestSort: (key: keyof T) => void;
  handleEdit: (item: T) => void;
  requestDeleteItem: (id: string) => void;
  confirmDeleteId: string | null;
  confirmDeleteItem: () => void;
  cancelDelete: () => void;
};

type LaborProps = CommonProps<Labor> & {
  items: Labor[];
  handleTogglePaidStatus: (id: string) => void;
};

type MaterialProps = CommonProps<Material> & {
  items: Material[];
  handleTogglePaidStatus: (id: string) => void;
};

type TaskProps = CommonProps<Task> & {
  items: Task[];
};

/* -------------------------------------------------------
   TASKS VIEW
-------------------------------------------------------- */

export const TasksView: React.FC<TaskProps> = ({
  items,
  sortConfig,
  requestSort,
  handleEdit,
  requestDeleteItem,
  confirmDeleteId,
  confirmDeleteItem,
  cancelDelete,
}) => {
  const th =
    "px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none";
  const td = "px-3 py-3 text-sm text-gray-700";

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className={th} onClick={() => requestSort("name")}>
              Name
            </th>
            <th className={th} onClick={() => requestSort("type")}>
              Type
            </th>
            <th className={th} onClick={() => requestSort("status")}>
              Status
            </th>
            <th className={th} onClick={() => requestSort("dueDate")}>
              Due Date
            </th>
            <th className="px-3 py-2" />
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {items.map((t) => (
            <tr key={t.id} className="hover:bg-gray-50/70">
              <td className={td}>{t.name}</td>
              <td className={td}>{t.type}</td>
              <td className={td}>
                <span className="text-xs font-medium text-gray-700">{t.status}</span>
              </td>
              <td className={td}>{t.dueDate || "—"}</td>
              <td className="px-3 py-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(t)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 text-base"
                    title="Edit"
                  >
                    <EditIcon className="h-5 w-5" />
                    <span className="leading-none">Edit</span>
                  </button>
                  {confirmDeleteId === t.id ? (
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={confirmDeleteItem}
                        className="px-2.5 py-1.5 rounded-md bg-rose-600 text-white text-sm"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={cancelDelete}
                        className="px-2.5 py-1.5 rounded-md border text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => requestDeleteItem(t.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 text-base"
                      title="Delete"
                    >
                      <TrashIcon className="h-5 w-5" />
                      <span className="leading-none">Delete</span>
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td className="px-3 py-6 text-sm text-gray-500" colSpan={5}>
                No tasks yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

/* -------------------------------------------------------
   LABOR VIEW
-------------------------------------------------------- */

export const LaborView: React.FC<LaborProps> = ({
  items,
  requestSort,
  handleEdit,
  requestDeleteItem,
  confirmDeleteId,
  confirmDeleteItem,
  cancelDelete,
  handleTogglePaidStatus,
}) => {
  const th =
    "px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none";
  const td = "px-3 py-3 text-sm text-gray-700";

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className={th} onClick={() => requestSort("workers")}>
              Workers
            </th>
            <th className={th} onClick={() => requestSort("crewRole")}>
              Role
            </th>
            <th className={th} onClick={() => requestSort("startDate")}>
              Date
            </th>
            <th className={th} onClick={() => requestSort("qty")}>
              Hours
            </th>
            <th className={th} onClick={() => requestSort("cost")}>
              Total (₱)
            </th>
            <th className={th}>Status</th>
            <th className="px-3 py-2" />
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {items.map((l) => (
            <tr key={l.id} className="hover:bg-gray-50/70">
              <td className={td}>{l.workers}</td>
              <td className={td}>{l.crewRole || "—"}</td>
              <td className={td}>{l.startDate || "—"}</td>
              <td className={td}>{l.qty ?? 0}</td>
              <td className={td}>₱{(l.cost ?? 0).toLocaleString()}</td>
              <td className={td}>
                <button
                  onClick={() => handleTogglePaidStatus(l.id)}
                  className="focus:outline-none"
                  title="Toggle paid status"
                >
                  <Pill state={l.paid ? "paid" : "unpaid"} />
                </button>
              </td>
              <td className="px-3 py-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(l)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 text-base"
                    title="Edit"
                  >
                    <EditIcon className="h-5 w-5" />
                    <span className="leading-none">Edit</span>
                  </button>
                  {confirmDeleteId === l.id ? (
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={confirmDeleteItem}
                        className="px-2.5 py-1.5 rounded-md bg-rose-600 text-white text-sm"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={cancelDelete}
                        className="px-2.5 py-1.5 rounded-md border text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => requestDeleteItem(l.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 text-base"
                      title="Delete"
                    >
                      <TrashIcon className="h-5 w-5" />
                      <span className="leading-none">Delete</span>
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td className="px-3 py-6 text-sm text-gray-500" colSpan={7}>
                No labor entries yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

/* -------------------------------------------------------
   MATERIALS VIEW (with clickable receipt link)
-------------------------------------------------------- */

export const MaterialsView: React.FC<MaterialProps> = ({
  items,
  requestSort,
  handleEdit,
  requestDeleteItem,
  confirmDeleteId,
  confirmDeleteItem,
  cancelDelete,
  handleTogglePaidStatus,
}) => {
  const th =
    "px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none";
  const td = "px-3 py-3 text-sm text-gray-700";

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt</th>
            <th className={th} onClick={() => requestSort("item")}>
              Item
            </th>
            <th className={th} onClick={() => requestSort("supplier")}>
              Supplier
            </th>
            <th className={th} onClick={() => requestSort("received")}>
              Received
            </th>
            <th className={th} onClick={() => requestSort("totalCost")}>
              Total (₱)
            </th>
            <th className={th}>Status</th>
            <th className="px-3 py-2" />
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {items.map((m) => {
            const receiptUrl = extractReceiptLink(m.notes);
            return (
              <tr key={m.id} className="hover:bg-gray-50/70">
                <td className="px-3 py-3">
                  {receiptUrl ? (
                    <a
                      href={receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center h-9 w-9 rounded-md border border-gray-300 hover:bg-gray-100 text-blue-600"
                      title="Open receipt"
                    >
                      <LinkIcon className="h-5 w-5" />
                    </a>
                  ) : (
                    <span
                      className="inline-flex items-center justify-center h-9 w-9 rounded-md border border-dashed border-gray-200 text-gray-300"
                      title="No receipt link"
                    >
                      <ImagePlaceholderIcon className="h-5 w-5" />
                    </span>
                  )}
                </td>
                <td className={td}>{m.item}</td>
                <td className={td}>{m.supplier || "—"}</td>
                <td className={td}>
                  {m.received ? (
                    <span className="inline-flex items-center text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                      Received
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                      Pending
                    </span>
                  )}
                </td>
                <td className={td}>₱{(m.totalCost ?? 0).toLocaleString()}</td>
                <td className={td}>
                  <button
                    onClick={() => handleTogglePaidStatus(m.id)}
                    className="focus:outline-none"
                    title="Toggle paid status"
                  >
                    <Pill state={m.paid ? "paid" : "unpaid"} />
                  </button>
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(m)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 text-base"
                      title="Edit"
                    >
                      <EditIcon className="h-5 w-5" />
                      <span className="leading-none">Edit</span>
                    </button>
                    {confirmDeleteId === m.id ? (
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={confirmDeleteItem}
                          className="px-2.5 py-1.5 rounded-md bg-rose-600 text-white text-sm"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={cancelDelete}
                          className="px-2.5 py-1.5 rounded-md border text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => requestDeleteItem(m.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 text-base"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                        <span className="leading-none">Delete</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
          {items.length === 0 && (
            <tr>
              <td className="px-3 py-6 text-sm text-gray-500" colSpan={7}>
                No materials yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
