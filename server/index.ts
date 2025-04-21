import express, { RequestHandler } from 'express';

const app = express();
app.use(express.json());

const RequestMiddleware: RequestHandler = (req, res, next) => {
  console.log('New req: ', req.method, req.path, '- body:', req.body);
  next();
};

app.use(RequestMiddleware);

app.get('/', (request, response) => {
  response.send('Hello World!');
});

app.get('/home', (req, res) => {
  // home page html file
  // res.sendFile()
  res.send(' Home Page route');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
