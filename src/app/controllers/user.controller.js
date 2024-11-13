const userModel = require('../models/user.model');


function getUser(req, res, next) {
  return res.status(200).json({
    status: 200,
    message: "user details",
  });
}

// function upDateUser(req, res, next) {
//     return res.status(200).json({
//       status: 200,
//       message: "user upDate",
//     });
//   }

  function deleteUser(req, res, next) {
    return res.status(200).json({
      status: 200,
      message: "user delete",
    });
  }




// async function addUser(req, res, next) {
//   const body = req.body;

//   console.log(body)
//   const user = await userModel.create(body);

//   return res.status(200).json({
//     status: 200,
//     message: "user created",
//     data: { user},
//   });
// }



async function addUser(req, res, next) {
  const {firstName, lastName} = req.body;

  if(!firstName|| !lastName){
    res.status(400);
    throw new Error('all filed are mandatory')
  }
  const contact = await userModel.create({
    firstName,
    lastName,
  });
  res.status(201).json({contact})
  
}

async function upDateUser(req, res, next) {
  const contact = await userModel.findById(req.params.id);
  if(!contact){
    res.status(404);
    throw new Error('not found UpData')
    
  }
  const upDateData = await userModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {new : true}
  );
  res.status(200).json(upDateData)
}


async function deleteUser(req, res, next) {
  const contact = await userModel.findById(req.params.id);
  if(!contact){
    res.status(404);
    throw new Error('not found delete')
    
  }

  await userModel.remove();
  
  res.status(200).json(contact)
}



module.exports = {
  getUser,
  addUser,
  upDateUser,
  deleteUser
};
