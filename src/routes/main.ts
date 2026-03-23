import { Router } from "express";
import { usersTable } from "../db/schema";
import { db } from "../libs/drizzle";
import { eq, sql } from "drizzle-orm";

const router = Router();

router.get("/ping", (req, res) => {
    res.json({ pong: true });
});

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

router.put("/user", async (req, res) => {
      await db 
        .update(usersTable)
        .set({age: 30})
        .where(eq(usersTable.age, 25))
        //eq é uma fução de comparação, onde o primeiro parâmetro é a coluna 
        //e o segundo é o valor que queremos comparar

    res.status(201).json({ message: "Usuário atualizado com sucesso" });
});

router.delete("/user", async (req, res) => {
    await db
        .delete(usersTable)
        .where(eq(usersTable.age, 30));

    res.status(201).json({ message: "Usuário deletado com sucesso" });
});

router.get("/users", async (req, res) => {
    const users = await db
    .select({
        name: sql<string>`lower(${usersTable.name})`,
        age: usersTable.age,
        email: usersTable.email,
        codigo: usersTable.id
        })
    .from(usersTable);

    res.json(users);
});
export default router;