import mongoose from 'mongoose'

const MedicationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    date: {
        type: String,
        // default: Date.now,
        required: true
    },
    time: {
        type: String,
        required: false
    },
    taken: {
        type: Boolean,
        required: true
    }
});

const Medications = mongoose.model('Medications', MedicationSchema);

module.exports = Medications;
