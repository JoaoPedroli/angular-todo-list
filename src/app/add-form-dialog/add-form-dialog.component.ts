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
  templateUrl: './add-form-dialog.component.html',
  styleUrls: ['../app.component.scss'],
})
export class AddFormDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public props: {
      getTodos: () => Todo[];
      setTodos: (todos: Todo[]) => any;
      setFilteredTodos: (filteredTodos: Todo[]) => any;
    },
    public dialogRef: MatDialogRef<AddFormDialogComponent>
  ) {}

  title: string;
  description: string;
  responsible: string;
  priority: 'alta' | 'media' | 'baixa';
  deadline: string;

  formControl = new FormControl('', [Validators.required]);

  matcher = new MyErrorStateMatcher();

  async confirm(
    message: string,
    confirmButton = 'Sim',
    cancelButton = 'Não',
    title = 'Tem certeza?',
    obj = {}
  ) {
    return await Swal.fire({
      title: title,
      text: message,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: 'var(--accent)',
      confirmButtonColor: 'var(--green)',
      cancelButtonText: cancelButton,
      confirmButtonText: confirmButton,
      ...obj,
    }).then((result) => result.isConfirmed);
  }

  close(): void {
    this.dialogRef.close();
  }

  async addTodo() {
    const areAllFieldsFilled = (): boolean =>
      this.title &&
      this.description &&
      this.responsible &&
      this.priority &&
      this.deadline
        ? true
        : false;

    if (areAllFieldsFilled()) {
      const isConfirmed = await this.confirm("Tem certeza de que deseja adicionar esta tarefa?");
      if(!isConfirmed) return;
      
      const newTodos = this.props.getTodos();
      const getNewIndex = (): number =>
        newTodos[newTodos.length - 1].data.index + 1;

      const todo = new Todo({
        index: getNewIndex(),
        title: this.title,
        description: this.description,
        responsible: this.responsible,
        priority: this.priority,
        deadline: this.deadline,
      });

      newTodos.push(todo);
      this.props.setTodos(newTodos);
      this.props.setFilteredTodos(newTodos);
      Swal.fire({
        title: 'Sucesso!',
        text: 'Tarefa criada com sucesso!',
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
