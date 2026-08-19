import express from "express";
import {
	bookAll,
	bookCreate,
	bookRent,
	bookDelete,
	bookReturn,
} from "../controllers/books.ctrl.js";
import {  isLoggedIn,  requireRole } from "../middlewares/auth.middleware.js";
import inputValidationBody from "../middlewares/validation.middleware.js";
import respondWith from "../middlewares/response.middleware.js";

import { CreateBookInput, BookResponse } from "../schemas/book.schema.js";

const booksRouter = express.Router();

booksRouter.get("/all",  isLoggedIn,  requireRole("owner"),  respondWith(BookResponse), bookAll);
booksRouter.post("/", isLoggedIn,  requireRole("owner"), inputValidationBody(CreateBookInput), bookCreate);
booksRouter.post("/:id",isLoggedIn,  requireRole("owner"), bookDelete);
booksRouter.post("/rent/:id",isLoggedIn,  requireRole("owner"), bookRent);
booksRouter.post("/return/:id",isLoggedIn,  requireRole("owner"), bookReturn);

export default booksRouter;
