// Update the imports at the top of todo.tsx
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTodos } from "../hooks/use-todos";
import { Loader2, Trash2, Edit, Plus, X } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { type CreateTodoInput, type Todo, todoBodySchema } from "../types";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

export default function TodoPage() {
    const {
        todos,
        isLoading,
        deleteTodo,
        updateTodo,
        isCreating,
        isUpdating,
        isDeleting,
        editingTodo,
        setEditingTodo,
        resetEditing,
        handleSubmit: submitHandler,
    } = useTodos();

    const form = useForm<CreateTodoInput>({
        resolver: zodResolver(todoBodySchema),
        defaultValues: {
            title: "",
            isCompleted: false,
        },
    });

    // Reset form when editingTodo changes
    useEffect(() => {
        if (editingTodo) {
            form.reset({
                title: editingTodo.title,
                isCompleted: editingTodo.isCompleted,
            });
        } else {
            form.reset({
                title: "",
                isCompleted: false,
            });
        }
    }, [editingTodo, form]);

    const onSubmit = (data: CreateTodoInput) => {
        submitHandler(data);
        if (!editingTodo) {
            form.reset();
        }
    };

    const handleToggleComplete = (id: string, isCompleted: boolean) => {
        updateTodo(id, { isCompleted });
    };

    if (isLoading && !todos?.data?.length) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-2xl font-bold mb-6">Todo List</h1>

            {/* Todo Form */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8">
                    <div className="flex gap-2">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormControl>
                                        <Input
                                            placeholder={editingTodo ? "Update todo..." : "Add a new todo..."}
                                            {...field}
                                            disabled={isCreating || isUpdating}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex gap-2">
                            <Button
                                type="submit"
                                disabled={isCreating || isUpdating}
                                className="flex items-center gap-2"
                            >
                                {(isCreating || isUpdating) ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : editingTodo ? (
                                    <span>Update</span>
                                ) : (
                                    <Plus className="h-4 w-4" />
                                )}
                            </Button>
                            {editingTodo && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        resetEditing();
                                        form.reset();
                                    }}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </form>
            </Form>

            {/* Todo List */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">Status</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead className="w-24 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {todos?.data?.map((todo: Todo) => (
                            <TableRow key={todo.id}>
                                <TableCell>
                                    <Checkbox
                                        className="h-8 w-8 border-solid border-2 border-primary"
                                        checked={todo.isCompleted}
                                        onCheckedChange={(checked) =>
                                            handleToggleComplete(todo.id, checked as boolean)
                                        }
                                    />
                                </TableCell>
                                <TableCell
                                    className={`${todo.isCompleted ? "line-through text-gray-500" : ""
                                        }`}
                                >
                                    {todo.title}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setEditingTodo(todo)}
                                            disabled={isUpdating}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => deleteTodo(todo.id)}
                                            disabled={isDeleting}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {!todos?.data?.length && (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                                    No todos yet. Add one above!
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}