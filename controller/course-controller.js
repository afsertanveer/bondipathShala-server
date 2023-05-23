const { ObjectId } = require("mongodb");
const Course = require("../model/Course");
const Student = require("../model/Student");
const Limit = 100;
//Create Courses
const createCourse = async (req, res, next) => {
  const { name, descr,status } = req.body;
  console.log(status);
  let existingCourse;
  // try {
  //   existingCourse = await Course.findOne({ name: name });
  // } catch (err) {
  //   console.log(err);
  //   return res.status(500).json("Something went wrong!");
  // }
  // if (existingCourse) {
  //   return res.status(400).json({ message: "course already exist" });
  // }
  const course = new Course({
    name: name,
    descr: descr,
    status: status
  });
  console.log(course);
  try {
    const doc = await course.save();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "course already exist" });
  }
  return res.status(201).json(course);
};
//get course
const getCourse = async (req, res, next) => {
  const courseId = req.query.courseId;
  let page = req.query.page;
  let skippedItem;
  if (page == null) {
    page = Number(1);
    skippedItem = (page - 1) * Limit;
  } else {
    page = Number(page);
    skippedItem = (page - 1) * Limit;
  }
  let course;
  try {
    course = await Course.findById(courseId).skip(skippedItem).limit(Limit);
  } catch (err) {
    return new Error(err);
  }
  if (!course) {
    return res.status(404).json({ message: "Course Not Found" });
  }
  return res.status(200).json(course);
};
//get all course
const getAllCourse = async (req, res, next) => {
  let courses;
  let page = req.query.page;
  let skippedItem;
  if (page == null) {
    page = Number(1);
    skippedItem = (page - 1) * Limit;
  } else {
    page = Number(page);
    skippedItem = (page - 1) * Limit;
  }
  try {
    courses = await Course.find(req.query).skip(skippedItem).limit(Limit).exec();
  } catch (err) {
    return new Error(err);
  }
  if (!courses) {
    return res.status(404).json({ message: "Courses Not Found" });
  }
  return res.status(200).json({ courses });
};

//use for functional work like dropdown load
const getAllCourseAdmin = async (req, res, next) => {
  let courses;
  try {
    courses = await Course.find({}, "name").exec();
  } catch (err) {
    return new Error(err);
  }
  if (!courses) {
    return res.status(404).json({ message: "Courses Not Found" });
  }
  return res.status(200).json(courses);
};
// const updateAll = async (req,res,next)=>{
//   const result = await Course.updateMany({name:"DU-course"},{status:false});
//   return res.status(200).json(result)

// }

const deactivateCourse = async(req,res,next)=>{
  const id = req.query.id;
  const filter = {_id: new ObjectId(id)};
  const result = await Course.findByIdAndUpdate(filter,{status:false});
  console.log(result);
  return res.status(200).json(result);
}
const updateSingle = async(req,res,next)=>{
  const id = req.query.id;
  const singleCourse = req.body;
  console.log(singleCourse);
  const filter = {_id: new ObjectId(id)};
  const result = await Course.findByIdAndUpdate(filter,singleCourse);
  return res.status(200).json(result);
}

// exports.updateAll = updateAll;
exports.createCourse = createCourse;
exports.getCourse = getCourse;
exports.getAllCourse = getAllCourse;
exports.getAllCourseAdmin = getAllCourseAdmin;
exports.deactivateCourse = deactivateCourse;
exports.updateSingle = updateSingle;
