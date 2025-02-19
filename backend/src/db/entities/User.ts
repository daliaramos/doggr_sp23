import { Collection, Entity, EntitySchema, OneToMany, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.js";
import { Match } from "./Match.js";


@Entity({ tableName: "users" })

export class User extends BaseEntity {	
	@Property()
	@Unique()
	email!: string;
	
	@Property()
	name!: string;
	
	@Property()
	petType!: string;

	@Property()
	isMached: boolean = false;
}
