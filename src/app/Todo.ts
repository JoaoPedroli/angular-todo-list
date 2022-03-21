export interface TodoProps {
  title: string;
  description?: string;
  responsible: string;
  priority?: 'alta' | 'media' | 'baixa';
  deadline?: string;
  situation?: 'em-andamento' | 'finalizada';
  index: number,
}

export class Todo {
  data: TodoProps;

  constructor(data: TodoProps) {
    data.situation = "em-andamento";
    this.data = data;
  }
}
