const { HTTP_STATUS } = require("../constants/status.constant");
const DietModel = require('../models/diet.model')


const addDiet = async (req, res) => {
  const { userId, date } = req.params;
  const { time, text } = req.body;
    try {
  let userDoc = await DietModel.findOne({ userId });

  if (!userDoc) {
    userDoc = new DietModel({
      userId,
      notes: [{ date, entries: [{ time, text }] }]
    });
  } else {
    const dateObj = userDoc.notes.find(n => n.date === date);
    if (dateObj) {
      dateObj.entries.push({ time, text });
    } else {
      userDoc.notes.push({ date, entries: [{ time, text }] });
    }
  }

  await userDoc.save();

  return res.status(200).json({
    userDoc,
    status: HTTP_STATUS.success,
    message: "add diet successfully",
  });

    } catch (error) {
      res.status(500).json({ error: "Internal server Error" });
    }
};


const getDiet = async (req, res) => {
  try {
    const { userId } = req.params;
    const userDoc = await DietModel.findOne({ userId });
    return res.status(200).json({
      userDoc,
      status: HTTP_STATUS.success,
      message: "get diet successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server Error" });
  }
};


const updateDiet = async (req, res) => {
  const { userId, date, id} = req.params;
  const { time, text } = req.body;
  try {
  const userDoc = await DietModel.findOne({ userId });
  if (!userDoc) return res.status(404).json({ error: 'User not found' });

  const dateObj = userDoc.notes.find(n => n.date === date);
  if (!dateObj) return res.status(404).json({ error: 'Date not found' });

  const entry = dateObj.entries.find(e => e.id == id);
  if (!entry) return res.status(404).json({ error: 'Entry not found' });

  entry.time = time;
  entry.text = text;

  await userDoc.save();
  return res.status(200).json({
    userDoc,
    status: HTTP_STATUS.success,
    message: "update diet successfully",
  });
  } catch (error) {
    res.status(500).json({ error: "Internal server Error" });
  }
};

const removeDiet = async (req, res) => {
  const { userId, date, id} = req.params;
  try {
  const userDoc = await DietModel.findOne({ userId });
  if (!userDoc) return res.status(404).json({ error: 'User not found' });

  const dateObj = userDoc.notes.find(n => n.date === date);
  if (!dateObj) return res.status(404).json({ error: 'Date not found' });

  const entry = dateObj.entries.find(e => e.id == id);
  if (!entry) return res.status(404).json({ error: 'Entry not found' });

  dateObj.entries = dateObj.entries.filter(e => e.id !== id);

  await userDoc.save();
  return res.status(200).json({
    userDoc,
    status: HTTP_STATUS.success,
    message: "delete diet successfully",
  });
  } catch (error) {
    res.status(500).json({ error: "Internal server Error" });
  }
}
module.exports = {
  addDiet,
  getDiet,
  updateDiet,
  removeDiet
};