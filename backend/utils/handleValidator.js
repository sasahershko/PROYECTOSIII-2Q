import  {validationResult} from "express-validator";

export default function validateResults (req, res, next) {
    try {
        validationResult(req).throw();
        return next();
    } catch (err) {
        res.status(403);
        res.json({ errors: err.array() });
    }
};
