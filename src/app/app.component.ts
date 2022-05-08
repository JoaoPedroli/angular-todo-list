import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { AddFormDialogComponent } from './add-form-dialog/add-form-dialog.component';
import { Todo } from './Todo';
import { ViewEditFormDialogComponent } from './viewedit-form-dialog/viewedit-form-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  dialogStyles: {};

  todos: Todo[] = [];

  filteredTodos: Todo[];
  todoDataToEdit: Todo;
  FilterNumber: number | null;
  FilterTitle_description: string;
  FilterResponsible: string;
  FilterPriority: 'alta' | 'media' | 'baixa' | null;
  FilterSituation: 'em-andamento' | 'finalizada' | null;
  displayedColumns: string[] = ['title', 'responsible', 'acoes'];

  handleResetFilters() {
    this.filteredTodos = this.todos;
    this.FilterNumber = null;
    this.FilterTitle_description = '';
    this.FilterResponsible = '';
    this.FilterPriority = null;
    this.FilterSituation = null;
  }

  constructor(public dialog: MatDialog) {
    this.dialogStyles = {
      maxHeight: '90vh',
      width: '90%',
      maxWidth: '70rem',
    };

    this.handleResetFilters();
  }

  haveFilter(): boolean {
    return !!(
      this.FilterNumber ||
      this.FilterTitle_description ||
      this.FilterResponsible ||
      this.FilterPriority ||
      this.FilterSituation
    );
  }

  openAddFormDialog(): void {
    this.dialog.open(AddFormDialogComponent, {
      ...this.dialogStyles,
      data: {
        getTodos: (): Todo[] => this.todos,
        setTodos: (v: Todo[]): void => {
          this.todos = v;
        },
        setFilteredTodos: (v: Todo[]): void => {
          this.filteredTodos = v;
        },
      },
    });
  }

  openViewEditFormDialog(isEdit: boolean, number: number): void {
    this.dialog.open(ViewEditFormDialogComponent, {
      ...this.dialogStyles,
      data: {
        isEdit: isEdit,
        number: number,
        todo: this.todos[number],
        getTodos: (): Todo[] => this.todos,
        setTodos: (v: Todo[]): void => {
          this.todos = v;
        },
        setFilteredTodos: (v: Todo[]): void => {
          this.filteredTodos = v;
        },
      },
    });
  }

  handleFilter() {
    if(!this.haveFilter()) return;

    this.filteredTodos = this.todos.filter(({ data }, i) => {
      data.index = i;
      const filterTitle = this.FilterTitle_description ?? data.title;
      const filterDescription =
        this.FilterTitle_description ?? data.description;
      const filterResponsible = this.FilterResponsible ?? data.responsible;

      return (
        i + 1 === (this.FilterNumber ?? i + 1) &&
        (data.title.slice(0, filterTitle.length) === filterTitle ||
          data.description?.slice(0, filterDescription.length) ===
            filterDescription) &&
        data.responsible.slice(0, filterResponsible.length) ===
          filterResponsible &&
        data.situation === (this.FilterSituation ?? data.situation) &&
        data.priority === (this.FilterPriority ?? data.priority)
      );
    });
  }

  toggleSituation(id: number): void {
    const toggleIsCompleted = (id: number) => {
      this.todos[id].data.situation =
        this.todos[id].data.situation === 'em-andamento'
          ? 'finalizada'
          : 'em-andamento';
    };

    toggleIsCompleted(id);
  }

  setTodoDataToEdit = (id: number): void => {
    this.todoDataToEdit = this.todos[id];
  };

  async handleRemove(id: number): Promise<void> {
    const isConfirmed = await Swal.fire({
      title: "Tem certeza?",
      text: "Tem certeza de que deseja remover esta tarefa?",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: 'var(--accent)',
      confirmButtonColor: 'var(--green)',
      cancelButtonText: "Não",
      confirmButtonText: "Sim",
    }).then((result) =>
      result.isConfirmed
    );
    if(!isConfirmed) return;

    this.todos = this.todos.filter((v, i) => i !== id);
    this.filteredTodos = this.todos;

    Swal.fire({
      title: 'Sucesso!',
      text: 'Tarefa removida com sucesso',
      icon: 'success',
      confirmButtonText: 'OK',
    });
  }
}
