import express from 'express'
import config from 'config'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from '../config/database'
import AppRouter from './routes'
import { errorMiddleware } from './middleware'
const app = express()

connectDB()
const router = new AppRouter(app)
app.use(cookieParser())
app.use(cors())
app.use(express.json())

app.set('port' , config.get('PORT') || 5555)
router.init()
app.use(errorMiddleware)




const PORT = app.get('port')
const server = app.listen( PORT , () =>{
    console.log(`server is running on port ${PORT}`)
})
export default server