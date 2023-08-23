import { ID, databases, storage } from '@/appwrite';
import { getTodosGroupedByColumn } from '@/lib/getTodosGroupedByColumn';
import { uploadImage } from '@/lib/uploadImage';
import { create } from 'zustand'

interface BoardStore {
  board: Board;
  searchString: string,
  taskInput: string,
  newTaskType: TypedColumn,
  getBoard: () => void,
  setBoardState: (board: Board) => void;
  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;
  setSearchString: (searchString: string) => void;
  deleteTodo: (taskIndex: number, todo: Todo, id: TypedColumn) => void;
  setNewTaskInput: (input: string) => void;
  setNewTaskType: (input: TypedColumn) => void;
  setImage: (image: File | null) => void;
  image: File | null;
  addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void;
}

export const useBoardStore = create<BoardStore>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
  searchString: "",
  taskInput: "",
  newTaskType: "todo",
  image: null,
  getBoard: async () => {
    const board = await getTodosGroupedByColumn();
    set({ board })
  },
  setBoardState: (board) => set({ board }),
  updateTodoInDB: async (todo, columnId) => {
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_COLLECTIONS_ID!,
      todo.$id,
      {
        title: todo.title,
        status: columnId
      }
    )
  },
  setSearchString: (searchString) => set({ searchString }),
  deleteTodo: async (taskIndex, todo, id) => {
    const newColumns = new Map(get().board.columns);

    newColumns.get(id)?.todos.splice(taskIndex, 1);

    set({
      board: {
        columns: newColumns
      }
    });

    if (todo.image) {

      const parsedImage = JSON.parse(todo.image)

      await storage.deleteFile(parsedImage.bucketId, parsedImage.fileId)
    }

    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_COLLECTIONS_ID!,
      todo.$id,
    )
  },
  setNewTaskInput: (input: string) => set({ taskInput: input }),
  setNewTaskType: (input: TypedColumn) => set({ newTaskType: input }),
  setImage: (image: File | null) => set({ image }),
  addTask: async (todo: string, columnId: TypedColumn, image?: File | null) => {
    let file: Image | undefined

    if (image) {
      const fileUploaded = await uploadImage(image);
      if (fileUploaded) {
        file = {
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.$id
        }
      }
    }

    const { $id } = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_COLLECTIONS_ID!,
      ID.unique(),
      {
        title: todo,
        status: columnId,
        //include image if it exists
        ...(file && {
          image: JSON.stringify(file)
        })
      }
    )

    set({
      taskInput: ""
    })

    set((state) => {
      const newColumns = new Map(state.board.columns)

      const newTodo: Todo = {
        $id,
        $createdAt: new Date().toISOString(),
        title: todo,
        status: columnId,
        //include image if it exists
        ...(file && {
          image: JSON.stringify(file)
        })
      };

      const column = newColumns.get(columnId)

      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo],
        })
      } else {
        newColumns.get(columnId)?.todos.push(newTodo)
      }

      return {
        board: {
          columns: newColumns
        }
      }
    })

  }
}))