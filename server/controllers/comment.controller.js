const UserModel = require('../models/user.model');
const CommentModel = require('../models/comment.model');

class CommentController {

    //[GET] /comment/:id
    /* 
    Đầu vào là params id của phim
    Đầu ra là comments trong mongodb
    */
   CommentOfMovie(req, res, next) {
    const movie_id = req.params.id;
    CommentModel.findOne({movie_id: movie_id}, (err, result) =>{
        if (err) {
            res.status(500).json({
                message: "query error",
            })
        }
        else {
            res.status(202).json({
                results: result,
            })
        }
    })
   }

   //[GET]/inputComment/:id
   /*
    */
   inputComment(req, res, next) {
        const movie_id = req.params.id;
        const {sender_id, comment, icon } = req.body;
        CommentModel.findOneAndUpdate({movie_id: movie_id}, {
            $push: {
                comments: {
                    sender: sender_id,
                    comment: comment,
                    icon: icon,
                }
            }
        }).then((result)=>{
            if (result != null) {
                res.status(202).json({
                    message: "save a new comment in movie_id successfully",
                })
            }
            else {

                let newComment = new CommentModel({
                    movie_id: movie_id,
                    comments: {
                        sender: sender_id,
                        comment: comment,
                        icon: icon,
                    }
                });

                newComment.save().then(()=>{
                    res.status(202).json({
                        message: "save a new comment in movie_id successfully",
                    })
                })
                .catch((err) => {
                    res.status(503).json({
                        message: err,
                    })
                })



            }
            
        })
        .catch((err) =>{
            res.status(502);
        })
   }
}

module.exports = new CommentController();