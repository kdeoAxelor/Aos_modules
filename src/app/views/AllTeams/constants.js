
  //edit.jsx
  const editDataReqBody = {
    fields: ["image", "roles", "members", "name", "description"],
    related: {},
  };
  //create.jsx
  const rolesReqBody = {
    translate: true,
    fields: ["id", "name"],
    limit: 10,
    data: { _domainContext: {} },
  };
  const membersReqBody = {
    translate: true,
    fields: ["id", "fullName", "partner", "name", "code"],
    limit: 10,
    data: { _domainContext: {} },
  };
  export { rolesReqBody , membersReqBody , editDataReqBody}