import { db } from "@/lib/db"

type Ctx = {
    id: string
}

export async function GET(_req: Request, { id }: Ctx) {
    try {
        const result = await db.execute({
            sql: 'SELECT * FROM users_data WHERE id = ?',
            args: [id]
        })
        return Response.json(result.rows, { status: 200 })
    } catch (error) {
        console.log(error)
        return Response.json({ error: "Failed to fetch user" }, { status: 500 })
    }
}

export async function PATCH(request: Request, { id }: Ctx) {
    try {
        const { name, email } = await request.json()

        if (!name || !email) return Response.json({ error: "Name and email are required" }, { status: 400 })

        const result = await db.execute({
            sql: 'UPDATE users_data SET name = ?, email = ? WHERE id = ?',
            args: [name, email, id]
        })
        return Response.json({ id, name, email }, { status: 200 })
    } catch (error) {
        console.log(error)
        return Response.json({ error: "Failed to update user" }, { status: 500 })
    }
}

export async function PUT(request: Request, { id }: Ctx) {
    try {
        const { name, email } = await request.json()

        if (!name || !email) return Response.json({ error: "Name and email are required" }, { status: 400 })

        const result = await db.execute({
            sql: 'UPDATE users_data SET name = ?, email = ? WHERE id = ?',
            args: [name, email, id]
        })
        return Response.json({ id, name, email }, { status: 200 })
    } catch (error) {
        console.log(error)
        return Response.json({ error: "Failed to update user" }, { status: 500 })
    }
}

export async function DELETE(request: Request, { id }: Ctx) {
    try {
        const result = await db.execute({
            sql: 'DELETE FROM users_data WHERE id = ?',
            args: [id]
        })
        return Response.json({ id }, { status: 200 })
    } catch (error) {
        console.log(error)
        return Response.json({ error: "Failed to delete user" }, { status: 500 })
    }
}
