import { Router } from "express";
import { usersTable } from "../db/schema";
import { db } from "../libs/drizzle";
import { desc, eq, sql } from "drizzle-orm";

const router = Router();
//ping route
router.get("/ping", (req, res) => {
    res.json({ pong: true });
});
//create user
router.post("/user",  async (req, res) => {
    const newUser: typeof usersTable.$inferInsert = {
        name: "Teste 3 da Silva",
        age: 12,
        email: "teste@teste3.com",
        obs: "Observação do usuário"
    }

    await db.insert(usersTable).values(newUser);
    res.status(201).json({ message: "Usuário criado com sucesso" });
});
//update user
router.put("/user", async (req, res) => {
      await db 
        .update(usersTable)
        .set({age: 30})
        .where(eq(usersTable.age, 25))
        //eq é uma fução de comparação, onde o primeiro parâmetro é a coluna 
        //e o segundo é o valor que queremos comparar

    res.status(201).json({ message: "Usuário atualizado com sucesso" });
});
//delete user 
router.delete("/user", async (req, res) => {
    await db
        .delete(usersTable)
        .where(eq(usersTable.age, 30));

    res.status(201).json({ message: "Usuário deletado com sucesso" });
});
//get users
router.get("/users", async (req, res) => {
    let perPage = 2;
    let currentPage = 1;

    const users = await db
    .select({
        name: sql<string>`lower(${usersTable.name})`,
        age: usersTable.age,
        email: usersTable.email,
        codigo: usersTable.id
        })
    .from(usersTable)
    .orderBy(desc(usersTable.name), desc(usersTable.id))
    .limit(2)
    .offset(1);

    res.json(users);
});
export default router;