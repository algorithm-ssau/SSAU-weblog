import postTemplate from '../templates/postTemplate.js';
// CHOOSE ALL
export const postsGetAll = async (req, res) => {
    try {
        const posts = await postTemplate.find().populate("user").exec();
        res.json(posts)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось получить статьи",
        })
    };
};
// CHOOSE ONE
export const postsGetOne = async (req, res) => {
    const postID = req.params.id;
    try {
        const doc = await postTemplate.findOneAndUpdate(
            { _id: postID },
            { $inc: { viewscount: 1 } },
            { returnDocument: "after" }
        );
    
        if (!doc) {
            return res.status(404).json({ message: "Статья не найдена" });
        }
    
        res.json(doc);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Не удалось вернуть статью" });
    }
};
// UPDATE
export const postsUpdateOne = async (req, res) => {
    try {
        const postID = req.params.id;
        const result = await postTemplate.updateOne(
            { _id: postID },
            {
                postTitle: req.body.postTitle,
                postText: req.body.postText,
                postImageUrl: req.body.postImageUrl,
                postTags: req.body.postTags,
                user: req.userId,
            }
        );
    
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Статья не найдена" });
        }
    
        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Не удалось обновить статью" });
    }
}    
// DELETE
export const postsDeleteOne = async (req, res) => {
    const postID = req.params.id;
    try {
        const doc = await postTemplate.findOneAndDelete({ _id: postID });
            
        if (!doc) {
            return res.status(404).json({ message: "Статья не найдена" });
        }
        
        res.json({
            message: "Статья удалена", 
            data: doc,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Не удалось удалить статью" });
    }
};
// CREATE
export const postsCreate = async (req, res) => {
    try {
        const doc = new postTemplate({
            postTitle: req.body.postTitle,
            postText: req.body.postText,
            postImageUrl: req.body.postImageUrl,
            postTags: req.body.postTags,
            user: req.userId,
        });

        const post = await doc.save();
        // response
        res.status(200).json(post);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось создать статью",
        })
    }
};