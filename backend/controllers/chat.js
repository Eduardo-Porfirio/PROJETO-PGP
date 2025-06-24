import jwt from "jsonwebtoken";
import pool from '../banco.js';

const secret = process.env.SECRET_KEY || 'seu_segredo_aqui';

async function id_user_token(token) {
  try {
    const decoded = jwt.verify(token, secret);
    console.log('ID do usuário:', decoded.id);
    console.log('Email:', decoded.email);
    return decoded;
  } catch (error) {
    console.error('Token inválido ou expirado:', error.message);
    return null;
  }
}



async function createRoom(req, res) {
  const { name_room, description,token,user} = req.body;
  const {id} = await id_user_token(token);

  console.log("id " + id);
  console.log("name_room " + name_room);
  console.log("description " + description);
  try{
    const create = await pool.query(`insert into back.room(name_room,description,admin_id)
                               values 
                               ($1,$2,$3)
                               RETURNING id_room;
                             `,[name_room,description,id]); 
    for(const users of user){
      await pool.query(
        `INSERT INTO back.user_room (id_user, id_room) VALUES ($1, $2)`,
        [users.id_user, create.rows[0].id_room]
      );
    }  
    res.status(200).json({ Status: "Sucesso", Room: name_room , Id_room: create.rows[0].id_room});                         
    

  }catch(erro){
    console.error('Erro ao criar sala:', erro);
    res.status(500).json({ erro: 'Erro no servidor' });
  }
  
}

async function return_user(req,res){
  try{
    const users = await pool.query (`
          SELECT id_user,name_user 
            FROM back.user 
          where id_user != 2
          order by name_user asc  ;

      `);
    res.status(200).json({lista : users.rows})
      
  }catch(err){
    res.status(500).json({ erro: 'Erro no servidor' });
  }
}

async function inserirUsers(req, res) {
  const { name_room, description,token } = req.body;
  const {id} = id_user_token(token);

  console.log("id " + id);
  console.log("name_room " + name_room);
  console.log("description " + description);
  try{
    const create = pool.query(`insert into back.room(name_room,description,admin_id)
                               values 
                               ($1,$2,$3);
                             `,[name_room,description,id]);
    res.status(200).json({ Status: "Sucesso", Room: name_room});                         

  }catch(erro){
    console.error('Erro ao inserir user:', erro);
    res.status(500).json({ erro: 'Erro no servidor' });
  }
  
}

async function rooms_user(req,res){
  const {id} = id_user_token(req.body.token);

  try{
    const rooms = await pool.query(`
        SELECT name_room,description,created_at
          FROM back.room
          JOIN back.user_room ON room.id_room = user_room.id_room  
        WHERE user_room.id_user = $1;
    `, [id] );

    res.status(200).json({ Status: "Sucesso", Rooms: rooms.rows});   
  }catch(err){
    console.error('Erro ao buscar salas:', err);
    res.status(500).json({ erro: 'Erro no servidor' });
  }
}

async function buscar_mensagens(req, res) {
  console.log(req.query);
  const { id_room,token } = req.query;
  const {id} = await id_user_token(token);

  try {
    const mensagens = await pool.query(`
      SELECT m.id_message, m.message_text, m.sent_at, u.name_user 
      FROM back.chat_message m
      JOIN back.user u ON m.sender_id = u.id_user
      WHERE m.id_room = $1 and m.sender_id in ($2,2) 
      ORDER BY m.id_message DESC
      LIMIT 9;
    `, [id_room, id]);

    // Ordena do mais antigo para o mais recente
    console.log('Mensagens encontradas:', mensagens);
    const mensagensOrdenadas = mensagens.rows.reverse();

    res.status(200).json({ Status: "Sucesso", Messages: mensagensOrdenadas });
  } catch (err) {
    console.error('Erro ao buscar mensagens:', err);
    res.status(500).json({ erro: 'Erro no servidor' });
  }
}

export default {id_user_token,createRoom,inserirUsers,return_user,rooms_user,buscar_mensagens};