import { Application } from "express";
import AuthRouter from './api/auth.routes'
import UserRouter from './api/user.routes'

class AppRouter{
    constructor(private app:Application){}
    init(){
        this.app.get("/", (_req, res) => {
            res.send("API Running");
        });
        this.app.use("/api/auth" , AuthRouter)
        this.app.use("/api/user" , UserRouter)
    }
}
export default AppRouter