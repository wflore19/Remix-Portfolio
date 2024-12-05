enum Role {
	Admin = "admin",
	Visitor = "visitor",
}

console.log(Role.Admin);

console.log(Role.Admin === Role.Admin);

console.log(Role.Admin < Role.Visitor);

console.log(Role.Admin > Role.Visitor);
