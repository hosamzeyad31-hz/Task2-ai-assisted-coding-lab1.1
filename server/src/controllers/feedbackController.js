import { Feedback } from '../models/Feedback.js';

// GET /api/feedback
export async function getAllFeedbacks(req, res, next) {
  try {
    const feedbacks = await Feedback.find();
    res.status(200).json({ feedbacks });
  } catch (err) {
    next(err);
  }
}

// GET /api/feedback/:id
export async function getFeedback(req, res, next) {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        message: 'Feedback not found',
      });
    }

    res.status(200).json({ feedback });
  } catch (err) {
    next(err);
  }
}

// POST /api/feedback
export async function createFeedback(req, res, next) {
  try {
    const feedback = await Feedback.create(req.body);

    res.status(201).json({ feedback });
  } catch (err) {
    next(err);
  }
}

// GET /api/feedback/summary?workshopCode=WS101
export async function getFeedbackSummary(req, res, next) {
  try {
    const { workshopCode } = req.query;

    if (!workshopCode) {
      return res.status(400).json({
        message: 'workshopCode is required',
      });
    }

    const result = await Feedback.aggregate([
      {
        $match: { workshopCode },
      },
      {
        $group: {
          _id: '$workshopCode',
          averageScore: { $avg: '$score' },
          feedbackCount: { $sum: 1 },
        },
      },
    ]);

    if (result.length === 0) {
      return res.status(200).json({
        workshopCode,
        averageScore: 0,
        feedbackCount: 0,
      });
    }

    res.status(200).json({
      workshopCode,
      averageScore: result[0].averageScore,
      feedbackCount: result[0].feedbackCount,
    });
  } catch (err) {
    next(err);
  }
}