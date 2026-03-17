import express, {Request, Response} from 'express';
import cors from 'cors';
import mainRoutes from './routes/main';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", mainRoutes);

app.use((req: Request, res: Response) => {
    res.status(404).json({ error: "Route not found" });
});

app.use((err: Error, req: Request, res: Response, next: Function) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong" });
});

app.listen(PORT, () => {
    console.log('Server is running on http://localhost:' + PORT);
});