import { describe, test, expect, beforeEach } from "vitest";
import { CircularList } from "./List";
import type { Workers } from "./List";
//create a test for the enque methot
describe("CircularList", () => {
  beforeEach(() => {
    //create a few workers
  });

  const workers: Workers[] = [
    {
      name: "Juan",
      age: 20,
      salary: 1000,
      idWorker: 1,
      ocupied: false,
    },
    {
      name: "Pedro",
      age: 20,
      salary: 1000,
      idWorker: 1,
      ocupied: false,
    },
    {
      name: "Maria",
      age: 20,
      salary: 1000,
      idWorker: 3,
      ocupied: false,
    },
    {
      name: "Luis",
      age: 20,
      salary: 1000,
      idWorker: 4,
      ocupied: false,
    },
    {
      name: "Luis",
      age: 20,
      salary: 1000,
      idWorker: 4,
      ocupied: false,
    },
  ];

  test("enque1", () => {
    //create a new CircularList
    const list: CircularList<Workers> = new CircularList();
    //add a new value to the list

    list.enque(workers[0]);
    const worker = workers[0];
    //check if the value is added
    //expect(list.enque(workers[1])).toBe(true);
  });

  test("enque", () => {
    //create a new CircularList
    const list: CircularList<Workers> = new CircularList();
    //add a new value to the list
    list.enque(workers[0]);
    let result: boolean | null = list.enque(workers[1]);
    list.enque(workers[2]);
    list.enque(workers[3]);
    //check if the value is added
    let array: Workers[] = list.toArray();
    expect(result).toBe(false);
    expect(array.length).toBe(3);
  });

  test("deque", () => {
    //create a new CircularList
    const list: CircularList<Workers> = new CircularList();
    //add a new value to the list
    list.enque(workers[0]);
    list.enque(workers[1]);
    list.enque(workers[2]);
    list.enque(workers[3]);
    list.enque(workers[4]);
    //check if the value is added
    let array: Workers[] = list.toArray();
    expect(array.length).toBe(3);
    let worker :Workers =list.dequeue(workers[0].idWorker);
    array = list.toArray();
    expect(array.length).toBe(2);
    expect(worker.name).toBe("Juan");
  });
  test("addTask", () => {
    //create a new CircularList
    const list: CircularList<Workers> = new CircularList();
    //add a new value to the list
    list.enque(workers[0]);
    list.enque(workers[1]);
    list.enque(workers[2]);
    list.enque(workers[3]);
    list.enque(workers[4]);
    //check if the value is added
    let array: Workers[] = list.toArray();
    expect(array.length).toBe(3);
    const newTask = {
      idTask: 1,
      name: "task1",
      description: "description1",
    };
    let result = list.addTask(newTask);
    expect(result).toBe(true);
  });
});

//test the que must not add a value if the id is already in the list
