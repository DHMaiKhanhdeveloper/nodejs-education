const Joi = require("joi");

const requestParam = (schema, name) => {
    return (req, res, next) => {
        console.log(req.params[name]);
        const ValidateResult = schema.validate({ idParam: req.params[name] });
        console.log("ValidateResult", ValidateResult);
        console.log("req.params[name]", req.params[name]);

        if (ValidateResult.error) {
            res.status(400).json(ValidateResult.error);
        }

        if (!req.value) {
            req.value = {};
        }
        if (!req.value["params_id"]) {
            req.value.params_id = {};
        }
        req.value.params_id[name] = req.params[name];
        next();
    };
};

const requestBody = (schema) => {
    return (req, res, next) => {
        const ValidateResult = schema.validate(req.body);
        console.log("ValidateResult", ValidateResult);

        if (ValidateResult.error) {
            res.status(400).json(ValidateResult.error); // không để res.status(400).json( "ValidateResult.error"+ ValidateResult.error)
        }

        if (!req.value) {
            req.value = {};
        }
        if (!req.value["params_id"]) {
            req.value.params_id = {};
        }
        req.value.reqBody = ValidateResult.value; // kiểm tra
        next(); // ko có hàm này ko chạy lên browser đại diện   res.status(200).json("");
    };
};

const schemas = {
    IDSchemas: Joi.object().keys({
        idParam: Joi.string()
            // .regex(/^[0-9a-fA-F]{24}$/)
            .pattern(new RegExp("^[0-9a-fA-F]{24}$"))
            .required(),
    }),
    usernameBody: Joi.object().keys({
        username: Joi.string().min(3).required(),
        job: Joi.string().min(3).required(),
        phone: Joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number must have 10 digits.`}),
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
            .required(),
        password: Joi.string().required().min(6),
    }),
    usernameOptionsBody: Joi.object().keys({
        username: Joi.string().min(3),
        job: Joi.string().min(3),
        phone: Joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number must have 10 digits.`}).required(),
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
        password: Joi.string().min(6),
    }),

    AuthenticationSignUp: Joi.object().keys({
        username: Joi.string().min(3).required(),
        job: Joi.string().min(3).required(),
        phone: Joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number must have 10 digits.`}).required(),
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
            .required(),
        password: Joi.string().required().min(6),
    }),
    AuthenticationSignIn: Joi.object().keys({
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
            .required(),
        password: Joi.string().required().min(6),
    }),
};

module.exports = {
    schemas,
    requestParam,
    requestBody,
};
