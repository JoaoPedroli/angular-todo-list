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
  templateUrl: './live-form-dialog.component.html',
  styleUrls: ['../app.component.scss'],
})
export class LiveFormDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public props: {
      getTodos: () => Todo[];
      setTodos: (todos: Todo[]) => any;
    },
    public dialogRef: MatDialogRef<LiveFormDialogComponent>
  ) {}

  title: string;
  description: string;
  responsible: string;
  priority: 'alta' | 'media' | 'alta';
  deadline: string;

  formControl = new FormControl('', [Validators.required]);

  matcher = new MyErrorStateMatcher();

  close(): void {
    this.dialogRef.close();
  }

  addTodo() {
    const areAllFieldsFilled = (): boolean =>
      this.title &&
      this.description &&
      this.responsible &&
      this.priority &&
      this.deadline
        ? true
        : false;

    if (areAllFieldsFilled()) {
      let todo = new Todo({
        title: this.title,
        description: this.description,
        responsible: this.responsible,
        priority: this.priority,
        deadline: this.deadline,
      });
      const newTodos = this.props.getTodos();
      newTodos.push(todo);
      this.props.setTodos(newTodos);
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
