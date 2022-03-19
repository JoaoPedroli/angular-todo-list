interface DataProps {
  title: string;
  description?: string;
  responsible: string;
  priority?: 'alta' | 'media' | 'alta';
  deadline?: string;
  situation?: 'em-andamento' | 'finalizado';
}

export class Todo {
  data: DataProps;

  constructor(data: DataProps) {
    data.situation = "em-andamento";
    this.data = data;
  }
}
