import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import app from "./app.js";
import {User} from "./db/entities/User.js";



async function DoggerRoutes(app: FastifyInstance, _options = {}){
	if(!app){
		throw new Error("Fastify instance has no value during routes construction");
	}
	app.get("/hello", async(req:FastifyRequest, reply:FastifyReply) =>{
		return "hello";
	});


	app.get("/dbTest", async(req:FastifyRequest, reply:FastifyReply) =>{
		return req.em.find(User, {});
	});

	/* //Core method for adding generic SEARCH http method
	app.route<{Body: {email:string}}>({
		method: "SEARCH",
		url: "/users",
		handler: async(req, reply) => {
			const {email} = req.body;
			try{
				const theUser = await req.em.findOne(User, {email});
				console.log(theUser);
				reply.send(theUser);
			}catch(err){
				console.log(err);
				reply.send(err);
			}
		}
	});
	*/

	app.post<{
		Body:{
			name: string,
			email: string,
			petType: string
		}
	}>("/users", async(req, reply) => {
		const {name, email, petType} = req.body;
		try{
			const newUser = await req.em.create(User,
				name,
				email,
				petType
			});
			await req.em.flush();
			
			console.log("created new user", newUser);
			return reply.send(newUser);
		}catch(err){
			console.log("failed to create a new user", err.message);
			return reply.status(500).send({message: err.message});
		}
	});

	//READ
	app.search("/users", async(req, reply) => {
		const {email} = req.body;
		try{
			const theUser = await req.em.findOne(User, {email});
			console.log(theUser);
			reply.send(theUser);
		}catch(err){
			console.log(err);
			reply.status(500).send(err);
		}
	});

	//update
	app.put<{
		Body:{
			name: string,
			email: string,
			petType: string
		}
	}>("/users", async(req, reply) => {
		const {name, email, petType} = req.body;

		const userToChange = await req.em.findOne(User, {email});
		userToChange.name = name;
		userToChange.petType = petType;

		await req.em.flush();
		console.log(userToChange);
		reply.send(userToChange);
	});


	//Delete
	app.delete<{Body: {email: string}}>("/users", async(req, reply) => {
		const {email} = req.body;
		try{
			const theUser = await req.em.findOne(User, {email});

			await req.em.remove(theUser).flush();
			console.log(theUser);
			reply.send(theUser);
		}catch(err){
			console.log(err)

			await req.em.flush();
			
			console.log("Created new user:", newUser);
			return reply.send(newUser);
		} catch (err) {
			console.log("Failed to create new user", err.message);
			return reply.status(500).send({message: err.message});
		}
	});
	
	// UPDATE
	app.put<{Body: ICreateUsersBody}>("/users", async(req, reply) => {
		const { name, email, petType} = req.body;
		
		const userToChange = await req.em.findOne(User, {email});
		userToChange.name = name;
		userToChange.petType = petType;
		
		// Reminder -- this is how we persist our JS object changes to the database itself
		await req.em.flush();
		console.log(userToChange);
		reply.send(userToChange);
		
	});
	
	// DELETE
	app.delete<{ Body: {email}}>("/users", async(req, reply) => {
		const { email } = req.body;
		
		try {
			const theUser = await req.em.findOne(User, { email });
			
			await req.em.remove(theUser).flush();
			console.log(theUser);
			reply.send(theUser);
		} catch (err) {
			console.error(err);
			reply.status(500).send(err);
		}
	});

}
export default DoggerRoutes;

