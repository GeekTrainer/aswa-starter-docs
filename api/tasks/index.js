const mongoose = require('mongoose');

mongoose.connect(process.env.CONNECTION_STRING, { useNewUrlParser: true });

const taskSchema = new mongoose.Schema({
    title: String,
    completed: {
        type: Boolean,
        default: false
    }
});

const TaskModel = mongoose.model('task', taskSchema);

module.exports = async function (context, req) {
    // setup our default content type
    context.res = {
        header: {
            "Content-Type": "application/json"
        }
    }

    switch (req.method) {
        case 'GET':
            await getTasks(context);
            break;
        case 'POST':
            await createTask(context);
            break;
        case 'PUT':
            await updateTask(context);
            break;
    }
};

async function getTasks(context) {
    // load all tasks from database
    const tasks = await TaskModel.find();
    // return all tasks
    context.res.body = { tasks: tasks };
}

async function createTask(context) {
    const body = context.req.body;
    console.log(body);
    // Save to database
    const task = await TaskModel.create(body);
    // return new object
    context.res.status = 201;
    context.res.body = task;
}

async function updateTask(context) {
    // Grab the ID
    const id = context.bindingData.id;
    // Update the item
    const result = await TaskModel.updateOne({ _id: id }, context.req.body);
    if (result.nModified === 1) {
        // Updated an item, status 204
        context.res.status = 204;
    } else {
        // Item not found, status 404
        context.res.status = 404;
    }
}
