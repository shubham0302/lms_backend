const Joi = require("joi");

class QuizValidator {
    static createQuiz() {
        return Joi.object({
            submodule:Joi.string().required(),
            cutoff:Joi.number().required(),
            cutoffispercent:Joi.boolean().required(),
            quizForm: Joi.array().items(Joi.object({
                question: Joi.string().required(),
                weightage: Joi.number().required(),
                type: Joi.string().required().valid('sa','la','mcma','mcsa'),
                subtype: Joi.array()
                .when('type', {
                    is: Joi.valid('mcma','mcsa'),
                    then: Joi.array(
                        
                    ).items(Joi.object({
                        answer: Joi.string().required(),
                        answer_type: Joi.string().required().valid('text','image'),
                        default: Joi.bool().required(),
                        weightage: Joi.number().required(),
                    })).min(2).required(),
                    otherwise: Joi.array().items(Joi.object({
                        answer: Joi.string().required(),
                        answer_type: Joi.string().required().valid('text','image'),
                        default: Joi.bool().required(),
                        weightage: Joi.number().required(),
                    })).required().length(0),
                  })
            })).required()  
        });
    }
    static appearForQuiz(){
        return Joi.object({
            quizForm: Joi.string().required(),
            answers: Joi.array().items(Joi.object({
                answer: Joi.string().allow('').required(),
                answerType:  Joi.string().required().valid('sa','la','mcma','mcsa'),
                evaluate: Joi.number().required(),
                question: Joi.string().hex().length(24).required(),
            })),
            company: Joi.string().required().allow(''),
        });
    }   
    static evaluateQuiz(){
        return Joi.object({
            answers: Joi.array().items(Joi.object({
                remarks: Joi.string().allow('').required(),
                evaluate: Joi.number().required(),
                answer: Joi.string().hex().length(24).required(),
            }))
        });
    }   
}

module.exports = {
    QuizValidator
}