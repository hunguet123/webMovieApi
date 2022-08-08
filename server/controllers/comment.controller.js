const UserModel = require('../models/user.model');
const CommentModel = require('../models/comment.model');
const { resolveInclude } = require('ejs');

class CommentController {

    //[GET] /comment/:id
    /* 
    Đầu vào là params id của phim
    Đầu ra là comments trong mongodb
    */
   CommentOfMovie(req, res, next) {
    const movie_id = req.params.id;
    CommentModel.find({movie_id: movie_id}, (err, result) =>{
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

   //[GEt]/comment/movie/:sender_id/:movie_id
   CommentBySenderInMovie(req, res, next) {
    const { sender_id, movie_id } = req.params;
    CommentModel.find({movie_id: movie_id, $or: [{"comments.sender": sender_id}, {"comments.repComments.sender": sender_id}] } ,('comments'))
    .find({$or: [{"comments.sender": sender_id}, {"comments.repComments.sender": sender_id}]})
    .then((result) => {
        res.status(202).json({
            comment: result,
        })
    })
    .catch((err) => {
        res.send(err);
    })
   }


   //thêm comment 
   inputComment(movie_id, sender_id, comment) {
    //const {movie_id, sender_id, comment} = req.body;
    CommentModel.findOne({movie_id: movie_id}).then((result) => {
        if (result) {
            pushComment(result);
        } else {
            createNewComment();
        }
    });
    function pushComment(result) {
        commentModel.updateOne({movie_id: movie_id}, {$push: {
            comments: {
                sender: sender_id,
                comment: comment,    
            }
        }}, (err, result) => {
            if (err) console.log({udateerr: err});
            else if (result) {
                console.log(result);
            }
        })
    }

    function createNewComment() {
        commentModel.create({
            movie_id: movie_id,
            comments: {
                sender: sender_id,
                comment: comment,
            }
            }, (err) => {
            if (err) console.log(err);
        })
    }

   }


   // thhêm icon vào comment
   pushIcon(movie_id, comment_id, icon, from) {
    //const {movie_id, comment_id, icon, from} = req.body;

    commentModel.updateOne({"movie_id" : movie_id, "comments._id": comment_id, "comments.icons.from": {$ne: from}},
    {$push: 
        {
            "comments.$.icons": 
            {
                "icon": icon, 
                "from": from
            }
    }
    }).then((resss) => {
        console.log(resss);
    });  
   }

   //thay đổi icon trong comment
   changeIcon(movie_id, comment_id, newIcon, from) {
    //const {movie_id, comment_id, newIcon, from } = req.body;
    commentModel.updateOne({"movie_id": movie_id, "comments._id": comment_id},{
        $set: {
            "comments.$.icons.$[i].icon": newIcon,
        }
    }, {
        arrayFilters: [
            {
                "i.from": from,
            }
        ]
    }).then((result) => {
        console.log(result);
    }).catch((err) => {
        console.log(err);
    })
   }

   //thêm rep comment 
   inputRepComment(movie_id, comment_id, sender_id, comment) {
    //const {movie_id, comment_id, sender, comment} = req.body;

    commentModel.updateOne({"movie_id": movie_id, "comments._id": comment_id }, {
        $push: {
            "comments.$.repComments": 
            {   
                "sender": sender_id,
                 "comment": comment,
            }
        }
    }).then((result) => {
        console.log(result);
    }).catch((err) => {
        console.log(err);
    })
   }

   //thêm icon vào repComment
   pushRepIcon(movie_id, comment_id, repComment_id , icon, from) {
    //const {movie_id, comment_id, repComment_id , icon, from } = req.body;
    CommentModel.updateMany({"movie_id": movie_id, "comments._id": comment_id, "comments.repComments.icons.from": {$ne: from}}, {
        $push: {
            "comments.$.repComments.$[rep].icons": {
                "icon": icon, 
                "from": from,
            }
        }
    }, {
        arrayFilters: [
            {
                "rep._id": repComment_id,
            }
        ]
    }).then((result)=> {
        console.log(result);
    }).catch((err)=> {
        console.log(err);
    })

   }

   // sửa đổi icon của repComment
   changeRepIcon(movie_id, comment_id, repComment_id, from_repIcon, newIcon ) {
    //const {movie_id, comment_id, repComment_id, from_repIcon, newIcon } = req.body;
    CommentModel.updateMany({"movie_id": movie_id, "comments._id": comment_id}, {
        $set: {
            "comments.$.repComments.$[rep].icons.$[icon].icon": newIcon,
        }
    }, {
        arrayFilters: [
            {
            "rep._id": repComment_id
            },
            {
            "icon.from": from_repIcon,
            }
    ]
    }).then((result)=> {
        console.log(result);
    }).catch((err)=> {
        console.log(err);
    })
   }

}

module.exports = new CommentController();