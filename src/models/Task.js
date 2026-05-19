const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: { 
        type: String, 
        enum: ['TODO', 'IN_PROGRESS', 'DONE'], 
        default: 'TODO' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);