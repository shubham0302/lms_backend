const { Schema, model } = require("mongoose");

const SubAnswerSchema = new Schema({
    answer: {
        type:String,
        default:''
    },
    weightage: {
        type:Number,
        default: 0,
    },
    answer_type: {
        type: String,
        enum: ['text','image'],
        default: 'text',
    },
    default: {
        type:Boolean,
        default: false,
    },
    answer_url: {
        type: String,
        default: ''
    }
});

const QuizSchema = new Schema({
    question: {
        type:String,
        default:'',
    },
    weightage:{
        type:Number,
        default:0,
    },
    type: {
        type: String,
        enum: ['sa','la','mcma','mcsa'],
        default: 'sa',
    },
    form: {
      type: Schema.Types.ObjectId,
      ref: 'QuizForm',
      required: true
    },
    subtype: {
        type: [SubAnswerSchema]
    }
});

const QuizFormSchema = new Schema({
    name: {
        type:String,
        default:'',
    },
    cutoff: {
        type:Number,
        default:0,
    },
    cutoffispercent: {
        type:Boolean,
        default:false,
    },
    name: {
        type:String,
        default:'',
    },
    submodule: {
        type: Schema.Types.ObjectId,
        ref: 'SubModule',
        required: true
    },
})

const QuizAttemptSchema = new Schema({
    answer: {
        type:String,
        default:'',
    },
    answerType: {
        type:String,
        enum: ['sa','la','mcma','mcsa'],
        default: 'sa',
    },
    evaluate: {
        type:Number,
        default:0,
    },
    trainee: {
        type: Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    question: {
        type: Schema.Types.ObjectId,
        ref:'Quiz',
        required:true,
    },
    remarks: {
        type:String,
        default:'',
    },
    form: {
      type: Schema.Types.ObjectId,
      ref: 'QuizForm',
      required: true
    },
    
})

const Quiz = model('Quiz',QuizSchema);
const QuizForm = model('QuizForm',QuizFormSchema);
const QuizAttempt = model('QuizAttempt',QuizAttemptSchema);

module.exports = {
    Quiz,
    QuizForm,
    QuizAttempt
}