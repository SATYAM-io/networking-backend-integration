import { db } from "@/lib/db"


type Ctx= {
    params:{id:string}
}
export async function GET(_req:Request, {params}:Ctx) {
     try {
            const result = await db.execute({
                sql: 'SELECT * FROM users_data WHERE id = ?',
                args:[params.id]
            })
            return Response.json(result.rows, {status: 200})
        } catch (error) {
            console.log(error)
            return Response.json({error:"Failed to fetch users"}, {status: 500})
        }
}


export async function PATCH(request:Request, {params}:Ctx) {
    try {
        const {name,email} = await request.json()

        if(!name || !email) return Response.json({error:"Name and email are required"}, {status: 400})

        const result = await db.execute({
            sql: 'UPDATE users_data SET name = ?, email = ? WHERE id = ?',
            args: [name, email, params.id]
        })
        return Response.json({id:result.lastInsertRowid, name, email}, {status: 200})
    } catch (error) {
        console.log(error)
        return Response.json({error:"Failed to update user"}, {status: 500})
    }
}

export async function PUT(request:Request, {params}:Ctx) {
    try {
        const {name,email} = await request.json()

        if(!name || !email) return Response.json({error:"Name and email are required"}, {status: 400})

        const result = await db.execute({
            sql: 'UPDATE users_data SET name = ?, email = ? WHERE id = ?',
            args: [name, email, params.id]
        })
        return Response.json({id:result.lastInsertRowid, name, email}, {status: 200})
    } catch (error) {
        console.log(error)
        return Response.json({error:"Failed to update user"}, {status: 500})
    }
}


export async function DELETE(request:Request, {params}:Ctx) {
    try {
        const result = await db.execute({
            sql: 'DELETE FROM users_data WHERE id = ?',
            args:[params.id]
        })
        return Response.json({id:result.lastInsertRowid, name, email}, {status: 200})
    } catch (error) {
        console.log(error)
        return Response.json({error:"Failed to delete user"}, {status: 500})
    }
}

