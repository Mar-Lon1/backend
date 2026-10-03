const StudentModel = require("../model/student")

//controller (waiter)

//create
const createUser= async(req,res,next) => {
   
    try {
        const student = await StudentModel.create(req.body)
        res.status(201).json(student)
    } catch (error) {
       next(error)
    }
}



//retrieve
const retrieveUser = async(req,res,next) => {
   try {
    const students = await StudentModel.find()
    res.status(200).json(students)
   } catch (error) {
    next(error)
   }
}


const getUserById = async (req,res,next) => {
    try {
        const student = await StudentModel.findById(req.params.id)
        if(!student) 
            return res.status(404).json({message: "Not Found"})
        res.status(200).json(student);
    } catch (error) {
        next(error)
    }
}

  const updateUser = async (req, res, next) => {
  try {
    const student = await StudentModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) return res.status(404).json({ message: "Not found" });
    res.status(200).json(student);
  } catch (error) {
    next(error)
  }
};

    const deleteUser = async (req, res, next) => {
  try {
    const student = await StudentModel.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ message: "Deleted" });
  } catch (error) {
    next(error)
  }
}



module.exports = {retrieveUser,createUser,getUserById,updateUser,deleteUser}