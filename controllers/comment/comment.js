const mongoose = require('mongoose');
const auth = require("../../routers/auth");
const Comments = mongoose.model('Comments');
const Hotels = mongoose.model("Hotels")
const Users = mongoose.model("Users");
exports.getComments = (async (req, res) => {

    await Comments.find()
        .then(comments => {
            res.status(200).send({comments: comments}
            )
        }).catch(err => {
            console.log(err);
            res.send({
                'status': 404,
                'message': err.message || 'Some error occurred while finding comment'
            })
        })
});

exports.findComment = async (req, res) => {
    await Comments.findOne({type: 1}, function (err, comments) {
        if (err) {
            console.log(err);
            return res.send({
                'status': 401,
                'message': 'comment not found'
            })
        } else {
            res.send({
                'status': 200,
                comment: comments
            })
        }
    })
};
exports.createComment = (req, res) => {
    const comment = new Comments({
        user: req.body.comment.user,
        hotel: req.body.comment.hotel,
        content: req.body.comment.content,
        order: 0,
    });
    console.log(typeof (req.body.comment.content))
    console.log(comment);
    Users.findOne({email: req.body.comment.user}, function (err, userSchema) {
        if (err) {
            return res.send({
                status: 401,
                'message': err
            });
        }
        if (userSchema) {
            const userId = req.email;
            console.log(userSchema.email);
            if (userId !== userSchema.email) {
                return res.send({
                    'status': 401,
                    'message': 'Thí chú không có quyền. Vui lòng liên hệ admin nhé!'
                })
            }
            Comments.find()
                .then(commentChecks => {
                    let cmCheck = new Comments();
                    comment.order++;
                    comment.user = userSchema;
                    comment.save()
                        .then( comment => {
                            return res.send({
                                comment: comment,
                                status: 200,
                                'message': "Thêm bình luận thành công"
                            });
                        }).catch(err => {
                        res.status(500).send({
                            'message': err.message || 'Some error occurred while creating the comment'
                        });
                    });
                }).catch(err => {
                res.send({
                    'status': 205,
                    'message': err.message || 'Some error occurred while creating the comment'
                })
            })
        } else {
            return res.send({
                status: 403,
                message: err
            });
        }
    });

};
exports.deleteComment = (auth.optional,
    (req, res) => {
        var mongoose = require('mongoose');
        var id = mongoose.Types.ObjectId(req.body.comment.id);
        Comments.deleteOne({_id: id}, function (err) {
            console.log('deleting projects');
            if (err) {
                console.log(err);
                return res.send({
                    status: 401,
                    message: "lỗi xóa comment"
                });
            }
            // delete project references
            return res.send({
                status: 200,
                message: "xóa comment thành công"
            });
        });
    });
