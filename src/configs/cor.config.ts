const allowedOrigins = [
     'http://localhost:3000',
     'http://localhost:8000',
]

const corsOptions = {
     origin: (origin: string | undefined, callback: Function) => {
          if (!origin || allowedOrigins.indexOf(origin) !== -1) {
               callback(null, true)
          } else {
               callback(new Error('Not allowed by CORS'))
          }
     },
     credentials: true,
}

export { corsOptions }
