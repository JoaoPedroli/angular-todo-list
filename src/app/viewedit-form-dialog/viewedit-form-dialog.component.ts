import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Todo } from '../Todo';
import Swal from 'sweetalert2';
import {
  AbstractControl,
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: AbstractControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-live-form-dialog',
  templateUrl: './viewedit-form-dialog.component.html',
  styleUrls: ['../app.component.scss'],
})
export class ViewEditFormDialogComponent {
  number: number;
  title: string;
  description: string | undefined;
  responsible: string;
  priority: 'alta' | 'media' | 'baixa' | undefined;
  deadline: string | undefined;
  situation: 'em-andamento' | 'finalizada' | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public props: {
      isEdit: boolean;
      number: number;
      todo: Todo,
      getTodos: () => Todo[];
      setTodos: (todos: Todo[]) => any;
      setFilteredTodos: (filteredTodos: Todo[]) => any;
    },
    public dialogRef: MatDialogRef<ViewEditFormDialogComponent>
  ) {
    this.number = props.number;
    this.title = props.todo.data.title;
    this.description = props.todo.data.description;
    this.responsible = props.todo.data.responsible;
    this.priority = props.todo.data.priority;
    this.deadline = props.todo.data.deadline;
    this.situation = props.todo.data.situation;
  }

  close(): void {
    this.dialogRef.close();
  }

  editTodo() {
    const areAllFieldsFilled = (): boolean =>
      this.title &&
      this.description &&
      this.responsible &&
      this.deadline
        ? true
        : false;

    if (areAllFieldsFilled()) {
      const newTodos = this.props.getTodos();
      const todo = new Todo({
        index: this.number,
        title: this.title,
        description: this.description,
        responsible: this.responsible,
        priority: this.priority,
        deadline: this.deadline,
        situation: this.situation,
      });
      newTodos[this.number] = todo;
      this.props.setTodos(newTodos);
      this.props.setFilteredTodos(newTodos);
      Swal.fire({
        title: 'Sucesso!',
        text: 'Tarefa editada com sucesso',
        icon: 'success',
        confirmButtonText: 'OK',
      });
      this.close();
    } else {
      Swal.fire({
        title: 'Preencha todos os campos!',
        text: 'Por favor, preencha todos os campos',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  }
}
