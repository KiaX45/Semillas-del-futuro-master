//create type Node
export type Node<Workers> = {
  value: Workers;
  next: Node<Workers> | null;
  before: Node<Workers> | null;
};

export type Task = {
  name: string;
  description: string;
  idTask: number;
};

export type Workers = {
  name: String;
  age: number;
  salary: number;
  idWorker: number;
  ocupied: boolean | Task;
};

export class CircularList<T> {
  //Creatión of atributes
  private head: Node<Workers> | null = null;
  private tail: Node<Workers> | null = null;

  //creatión of methots
  public enque(value: Workers): boolean | null {
    const node: Node<Workers> = {
      value: value,
      next: null,
      before: null,
    };
    if (!this.head) {
      this.head = node;
      this.head.next = this.head;
      this.head.before = this.head;
      return true;
    }
    if (this.locate(value)) return false;

    if (!this.tail) {
      this.tail = node;
      this.head.next = this.tail;
      this.tail.next = this.head;
      this.head.before = this.tail;
      this.tail.before = this.head;
      return true;
    }

    this.tail.next = node;
    node.before = this.tail;
    node.next = this.head;
    this.head.before = node;
    this.tail = node;
    return true;
  }
  //dequeue methot
  public dequeue(idWorker: number): Workers | null {
    if (!this.head) {
      return null;
    }
    if (this.head.value.idWorker === idWorker) {
      const node = this.head;
      this.head = this.head.next;
      this.tail.next = this.head;
      this.head.before = this.tail;
      return node.value;
    }
    let node: Node<Workers> | null = this.head;
    do {
      if (node.value.idWorker === idWorker) {
        node.before.next = node.next;
        node.next.before = node.before;
        return node.value;
      }
      node = node.next;
    } while (node != this.head);
    return null;
  }

  public locate(value: Workers): Workers | null {
    if (!this.head) {
      return null;
    }
    if (this.head.value.idWorker === value.idWorker) {
      return this.head.value;
    }

    let aux: Node<Workers> | null = this.head;
    do {
      if (aux.value.idWorker === value.idWorker) {
        return aux.value;
      }
      aux = aux.next;
    } while (aux != this.head);
  }

  public addTask(task: Task): boolean | null {
    const worker = this.freeWorker();
    if (!worker) return false;
    worker.value.ocupied = task;
    return true;
  }

  public freeWorker(): Node<Workers> | null {
    if (!this.head) return null;
    let aux: Node<Workers> | null = this.head;
    do {
      if (!aux.value.ocupied) {
        return aux;
      }
      aux = aux.next;
    } while (aux != this.head);
    return null;
  }

  public getTaskid(): number{
    let idTask: number = 0;
    if(!this.head) return -1;
    let aux: Node<Workers> | null = this.head;
    do {
      if (aux.value.ocupied) {
       let task: Task = aux.value.ocupied as Task;
        if(task.idTask > idTask) idTask = task.idTask;
      }
      aux = aux.next;
    } while (aux != this.head);
    return idTask;

  }

  public eliminateTask(workerid: number): boolean{
    if(!this.head) return false;
    let aux: Node<Workers> | null = this.head;
    do{
      if(aux.value.idWorker === workerid){
        aux.value.ocupied = false;
        return true;
      }
      aux = aux.next;
    }while(aux != this.head);

    return true;
  }


  //to array
  public toArray(): Workers[] {
    const array: Workers[] = [];
    let node: Node<Workers> | null = this.head;
    if (!node) {
      return array;
    }
    do {
      array.push(node.value);
      node = node.next;
    } while (node != this.head);
    return array;
  }
  public getlastid(): number {
    if (!this.head) {
      return 0;
    }
    if (!this.tail) return this.head.value.idWorker;
    return this.tail.value.idWorker;
  }
}

export const workersList: CircularList<Workers> = new CircularList();
