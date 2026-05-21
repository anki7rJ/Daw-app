import {JwtPayload} from 'jsonwebtoken'

export interface CustomUserPayload extends JwtPayload{
    id:string
    email:string
}

declare global{
    namespace Express{
        interface Request{
            user?:CustomUserPayload
        }
    }
}

