import config from "config"
import { NextFunction, Request, Response } from "express"

const tryCatchMiddleware = (controller:Function , setCookie:boolean = true) => {
    return async (req:Request , res: Response , next:NextFunction) =>{
        try {
            
            const {status,data} = await controller(req, res , next)
            res.status(status).json(data)
        } catch (err:any) {
            
            console.log(err.message)
            next(err)
        }
    }
}
export default tryCatchMiddleware