import express from 'express';
import bodyParser from 'body-parser';
import {uuid} from 'uuidv4';

const app = express();

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

interface TaskData {
    id : string;
    text : string,
    completed : boolean,
    deadlineDate?: Date,
    dateCreated : Date
}

const tasks : TaskData[] = [];

//Lista as tasks
app.get('/tasks', (request, response) => {
    return response.json(tasks);
});

//Cria task
app.post('/tasks', (request, response) => {
    const {
        text,
        deadlineDate = null
    } = request.body;

    const task : TaskData = {
        id: uuid(),
        text: text,
        completed: false,
        deadlineDate: deadlineDate,
        dateCreated: new Date()
    }

    tasks.push(task);

    return response.json(task);
});

//Marca task como completa
app.put('/tasks/:id/complete', (request, response) => {

    const {id} = request.params;

    const taskIndex = tasks.findIndex(task => task.id === id);

    if (taskIndex < 0) {
        return response
            .status(400)
            .json({"error": "Task not found."});
    }

    tasks[taskIndex].completed = true;

    return response.json(tasks[taskIndex]);
});

//Delete a task
app.delete('/tasks/:id', (request, response) => {
    const { id } = request.params;

    const taskIndex = tasks.findIndex(task => task.id === id);

    if (taskIndex < 0) {
        return response
            .status(400)
            .json({"error": "Task not found."});
    }

    tasks.splice(taskIndex,1);

    return response.json(204);
});

app.listen(3333);
