import express from "express";
import {
	bookAll,
	bookCreate,
	bookRent,
	bookDelete,
	bookReturn,
} from "../controllers/books.ctrl.js";

import inputValidationBody from "../middlewares/validation.middleware.js";
import respondWith from "../middlewares/response.middleware.js";

import { CreateBookInput, BookResponse } from "../schemas/book.schema.js";

const booksRouter = express.Router();

booksRouter.get("/all", respondWith(BookResponse), bookAll);
booksRouter.post("/", inputValidationBody(CreateBookInput), bookCreate);
booksRouter.post("/:id", bookDelete);
booksRouter.post("/rent/:id", bookRent);
booksRouter.post("/return/:id", bookReturn);

export default booksRouter;
