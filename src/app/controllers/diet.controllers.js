const { HTTP_STATUS } = require("../constants/status.constant");
const DietModel = require('../models/diet.model')
const userModel = require("../models/user.model");
const moment = require("moment");

const addDiet = async (req, res) => {
  const { userId, date } = req.params;
const { time, text } = req.body;                                    

   const Time = moment(time, "hh:mm A").format("hh:mm A");

  try {      
    // Find doc where both userId and date match
    let doc = await DietModel.findOne({ userId, date: new Date(date) });

    if (doc) {
      // Add new entry to existing document
    doc.entries.push({ time: Time, text });                                           
      await doc.save();
      return res.status(200).json({
        message: "Entry added to existing document",
        data: doc,
      });
    }
    
    // Create new document (even if userId already exists for another date)
    const newDoc = new DietModel({
      userId,
      date: new Date(date),
      entries: [{ time: Time, text }],
    });

    await newDoc.save();
    return res.status(201).json({
      message: "New document created",
      data: newDoc,
    });

  } catch (error) {
    console.error("addDiet error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


const getDiet = async (req, res) => {
  const { userId, date } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  const user = await userModel.findById(userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  try {
    let filter = { userId };
    if (date) filter.date = date;

    const diets = await DietModel.find(filter);

    return res.status(200).json({
      message: "Diet records fetched",
      user: user,
      data: diets,
    });
  } catch (error) {
    console.error("getDiet error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


const updateDiet = async (req, res) => {
  const { userId, date, id } = req.params;
  const { text, time } = req.body;
     const Time = moment(time, "hh:mm A").format("hh:mm A");
    
  try {
    const doc = await DietModel.findOne({ userId, date,});

    if (!doc) {
      return res.status(404).json({ error: "Diet entry not found" });
    }

    const entry = doc.entries.find(e => e.id === id);

    if (!entry) {
      return res.status(404).json({ error: "Id not found" });
    }

    entry.text = text;
    entry.time = Time;
    
    await doc.save();

    return res.status(200).json({
      message: "Entry updated successfully",
      data: doc,
    });

  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


const removeDiet = async (req, res) => {
  const { userId, date, id } = req.params;
  try {
    // Make sure date is Date type
    const doc = await DietModel.findOne({ userId, date: new Date(date) });

    if (!doc) {
      return res.status(404).json({ error: "Diet entry not found" });
    }

    // Use _id for subdocument
    const entry = doc.entries.find(e => e._id.toString() === id);

    if (!entry) {
      return res.status(404).json({ error: "Id not found" });
    }

    doc.entries = doc.entries.filter(e => e._id.toString() !== id);

    if (doc.entries.length === 0) {
      await doc.deleteOne();
      return res.status(200).json({
        message: "Entry removed and document deleted as no entries left.",
      });
    }

      await doc.save();
      return res.status(200).json({
        message: "Entry removed successfully",
      });
    
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


const copyDietToAnotherDay = async (req, res) => {
  const { userId, fromDate, toDate } = req.params; // fromDate = jis din ka data copy karna hai, toDate = jisme copy karna hai
  try {
    // 1. Find source day's document
    const fromDoc = await DietModel.findOne({ userId, date: new Date(fromDate) });
    if (!fromDoc) {
      return res.status(404).json({ error: "Source day's diet not found" });
    }

    // 2. Check if target day's document exists
    let toDoc = await DietModel.findOne({ userId, date: new Date(toDate) });

    if (toDoc) {
      // Overwrite entries
      toDoc.entries = fromDoc.entries.map(e => ({
        time: e.time,
        text: e.text
      }));
      await toDoc.save();
    } else {
      // Create new document
      toDoc = new DietModel({
        userId,
        date: new Date(toDate),
        entries: fromDoc.entries.map(e => ({
          time: e.time,
          text: e.text
        }))
      });
      await toDoc.save();
    }

    return res.status(200).json({
      message: "Diet copied successfully",
      data: toDoc,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = {
  addDiet,
  getDiet,
  updateDiet,
  removeDiet,
  copyDietToAnotherDay
};