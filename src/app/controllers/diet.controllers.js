
const Note = require('../models/diet.model')

// const getNotes = async (req, res) => {
//   const { startDate, endDate } = req.query;
//   try {
//     const notes = await Note.find({
//       userId: req.user.id,
//       date: { $gte: startDate, $lte: endDate },
//     });
//     res.json(notes);
//   } catch (err) {
//     res.status(500).json({ msg: 'Server error' });
//   }
// };

async function addOrUpdateNote (req, res){
  const { date, time, text } = req.body;
  try {
    let note = await Note.findOne({ userId: req.user.id, date, time });
    if (note) {
      note.text = text;
    } else {
      note = new Note({ userId: req.user.id, date, time, text });
    }
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// const deleteNote = async (req, res) => {
//   const { date, time } = req.body;
//   try {
//     await Note.findOneAndDelete({ userId: req.user.id, date, time });
//     res.json({ msg: 'Note deleted' });
//   } catch (err) {
//     res.status(500).json({ msg: 'Server error' });
//   }
// };


module.exports = {
//   getNotes,
  addOrUpdateNote,
//   deleteNote
};