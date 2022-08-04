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

   inputComment(movie_id, sender_id, comment, icon) {
        CommentModel.findOneAndUpdate({movie_id: movie_id}, {
            $push: {
                comments: {
                    sender: sender_id,
                    comment: comment,
                    $push: {
                        icon: icon,
                    }
                }
            }
        }).then((result)=>{
            if (result != null) {
                console.log("save a new comment in movie_id successfully");
            }
            else {
                let newComment = new CommentModel({
                    movie_id: movie_id,
                    comments: {
                        sender: sender_id,
                        comment: comment,
                        $push: {
                            icon: icon,
                        }
                    }
                });

                newComment.save().then(()=>{
                    console.log("save a new comment in movie_id successfully");
                })
                .catch((err) => {
                    console.log(err);
                })



            }
            
        })
        .catch((err) =>{
            console.log(err);
        })
   }
}

module.exports = new CommentController();