const router = require("express").Router();
const { getMediaList } = require("../middleware/media");
const reviewController = require("../controllers/index");

router
  .route("/")
  .post(getMediaList, reviewController.createReview)
  .get(reviewController.getAllReviews)
  .delete(reviewController.deleteReview)
  .patch(reviewController.updateReview);

router.use("/:id", reviewController.getOneReview);

module.exports = router;
