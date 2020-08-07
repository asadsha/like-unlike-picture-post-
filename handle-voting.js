import Model from "../Models/Model";

// voting on article {upvoting or downvoting}
// resourceId is id of article
const voteArticle = (req, res, next) => {
  const { resourceId, vote } = req.body;
  Model.ArticleModel.find({ _id: resourceId })
    // newVote and prevVote for makeing logic related to.... if we need to remove vote and then add new vote or just need to remove vote
    .then((article) => {
      let newType = "";
      let prevType = "";
      let upvoteCount = 0;
      let downvoteCount = 0;
      if (article[0].votes.length > 0) {
        article[0].votes.map((el, index) => {
          // here we are checking if user has voted before then first we will delete previous vote first
          if (el.userId == vote.userId) {
            console.log("inside removing check");
            article[0].votes.splice(index, 1);
            newType = vote.type;
            prevType = el.type;
          }
        });
      }
      // if newVote  and prevVote are '' then it means there was no vote of user before then we will simply add new vote
      // if newVote and prevVote are not '' and are equal then it means user want to remove his vote by repeating same type of vote {{ type means upvote or downvote}}
      // if newVote and prevVote are not '' amd are not equal it means user want to change his vote type
      if (newType !== "" && newType === prevType) {
        article[0].userVoteStatus.downvote = false;
        article[0].userVoteStatus.upvote = false;
      } else {
        article[0].votes.push(vote);
        if (vote.type === "upvote") {
          article[0].userVoteStatus.upvote = true;
          article[0].userVoteStatus.downvote = false;
        } else {
          article[0].userVoteStatus.downvote = true;
          article[0].userVoteStatus.upvote = false;
        }
      }
      // here we are just getting the upvote and downvote count
      if (article[0].votes.length > 0) {
        article[0].votes.map((el) => {
          if (el.type === "upvote") {
            upvoteCount += 1;
          }
          if (el.type === "downvote") {
            downvoteCount += 1;
          }
        });
      }
      // sending different responses on the base of vote removed or vote changed
      article[0]
        .save()
        .then((doc) => {
          if (newType === prevType && newType !== "") {
            res.status(200).send({
              Message: "vote removed Successfully",
              userVoteStatus: doc.userVoteStatus,
              upvoteCount,
              downvoteCount,
            });
          } else {
            res.status(200).send({
              Message: "voted  Successfully.",
              vote: doc.votes[doc.votes.length - 1],
              userVoteStatus: doc.userVoteStatus,
              upvoteCount,
              downvoteCount,
            });
          }
        })
        // eslint-disable-next-line no-unused-vars
        .catch((err) => {
          res.status(500);
          next(new Error("Unable to vote. Please Try later."));
        });
    })
    .catch(() => {
      res.status(500).send({ Message: "Can not vote right now" });
    });
};
