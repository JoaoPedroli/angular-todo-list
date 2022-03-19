import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LiveFormDialogComponent } from './live-form-dialog/live-form-dialog.component';
import { Todo } from './Todo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  todos: Todo[] = [
    new Todo({
      deadline: '2022-03-15',
      description: 'asdasd asid sdasndoasnd sdasiodnoansdonasnas dasdnjasbdjnasdbjsa asdhhsdhaoshd',
      priority: 'alta',
      responsible: 'Jaooo Pedroooooooosidh ssns sios oi ksnsjns js sj jsjb j sjs sbbj sb sh sshssh hgss yvuiaiuv sduiv aus vaus duyav sdyv auy shdv usdv uiasv d',
      situation: 'em-andamento',
      title: 'saodpans sadhjsdoaishdoi oiisodis ijo aoisdioaiosd i sd sdii iausbduiob sdb 8 ausbd 0y bsdby auysvdu0b asuyd uyas di0g asduiobg asuiodu ais dbuio',
    }),
    new Todo({
      deadline: '2022-03-15',
      description: 'asdasd',
      priority: 'alta',
      responsible: 'asdasd',
      situation: 'em-andamento',
      title: 'asdsd',
    }),
  ];
  number: number;
  title_description: string;
  responsible: string;
  priority: 'alta' | 'media' | 'baixa' | null;
  situation: 'em-andamento' | 'finalizado' | null;
  displayedColumns: string[] = ['title', 'responsible'];
  
  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    this.refresh(this.todos);
  }

  refresh(todos: Todo[]) {
    this.todos = new Array<Todo>();
    this.todos = todos;
    this.todos = this.todos;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(LiveFormDialogComponent, {
      maxHeight: '90vh',
      width: '90%',
      maxWidth: '70rem',
      data: {
        getTodos: (): Todo[] => this.todos,
        setTodos: (v: Todo[]):void => this.refresh(v),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('closed');
    });
  }

  searchTodos() {
    console.log(this.todos);
  }

  done(id: number): void {
    const toggleIsCompleted = (id: number) => {
      this.todos[id].data.situation =
        this.todos[id].data.situation === 'em-andamento'
          ? 'finalizado'
          : 'em-andamento';
    };

    toggleIsCompleted(id);
  }

  remove(id: number): void {
    this.todos = this.todos.filter((v, i) => i !== id);
  }
}
