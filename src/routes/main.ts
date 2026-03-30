import { Router } from "express";
import { usersTable } from "../db/schema";
import { petsTable } from "../db/schema";
import { db } from "../libs/drizzle";
import { desc, eq, sql, } from "drizzle-orm";
import { error } from "console";

const router = Router();
//ping route
router.get("/ping", (req, res) => {
    res.json({ pong: true });
});

//function to transfer balance between users
const transfer = async (val: number, userFrom: number, userTo: number) => {
    //Iniciando a transação
    await db.transaction(async (tx) => {
        //Selecionando o saldo do usuário que irá transferir
        const [accountFrom] = await tx
        .select({ balance: usersTable.balance })
        .from(usersTable)
        .where(eq(usersTable.id, userFrom));
        //Verificando se o usuário tem saldo suficiente para realizar a transferência
        if(accountFrom.balance && accountFrom.balance < val) {
            tx.rollback();
            throw new Error("Saldo insuficiente");
        };
        //Atualizando o saldo do usuário que irá fazer a transferência
        await tx.update(usersTable)
        .set({balance: sql`${usersTable.balance} - ${val}`})
        .where(eq(usersTable.id, userFrom));
        //Atualizando o saldo do usuário que irá receber a transferência
        await tx.update(usersTable)
        .set({balance: sql`${usersTable.balance} + ${val}`})
        .where(eq(usersTable.id, userTo));
    });
}
//deposit route
router.post("/deposit", async (req, res) => {
    await transfer(100, 2, 5);

    res.json({ error: null});
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
        id: usersTable.id,
        name: usersTable.name,
        petName: petsTable.name,
        petId: petsTable.id
    })
    .from(usersTable)
    .rightJoin(petsTable, eq(petsTable.ownerId, usersTable.id))

    res.json(users);
});
export default router;