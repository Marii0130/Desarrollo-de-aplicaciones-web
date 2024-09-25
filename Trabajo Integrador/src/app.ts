import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
const port = 4100;
const app = express();
import estudianteRouter from './routes/estudianteRouter';
import profesorRouter from './routes/profesorRouter';
import cursoRouter from './routes/cursoRouter';
import inscripcionRouter from './routes/inscripcionRouter';

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.get('/', (req,res)=>{
	res.send('App universidad');
});
app.use('/estudiantes', estudianteRouter);
app.use('/profesores', profesorRouter);
app.use('/cursos', cursoRouter);
app.use('/inscripciones', inscripcionRouter);

export default app;