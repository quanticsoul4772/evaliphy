import {pino} from "pino";


const isDebug = process.env.DEBUG === 'evaliphy' || process.env.DEBUG === '*'
const isDev   = process.env.NODE_ENV !== 'production'

export const logger = pino({
    name: 'evaliphy',
    level: isDebug ? 'debug' : 'info',
    transport: isDev
        ? {
            target: 'pino-pretty',
            options: {
                colorize: true,
                ignore: 'pid,hostname',
                translateTime: 'SYS:HH:MM:ss'
            }
        }
        : undefined
})