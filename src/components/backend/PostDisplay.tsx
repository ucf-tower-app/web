import { useEffect, useState } from "react";
import { getCurrentUser } from "../../xplat/api";
import { Comment, Post } from "../../xplat/types/types";
import CommentDisplay from "./CommentDisplay";


const PostDisplay = ({post}: {post: Post}) => {
    const [author, setAuthor] = useState('!!!');
    const [textContent, setTextContent] = useState("!!!");
    const [imageUrls, setImageUrls] = useState<string[] | undefined>(undefined);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newCommentText, setNewCommentText] = useState<string>("nice send");
    const [thumbnailUrl, setThumbnailUrl] = useState<string| undefined>(undefined);
    const [videoUrl, setVideoUrl] = useState<string| undefined>(undefined);
    
    useEffect(() => {
        async function fetch() {
            await post.getData();
            post.getTextContent().then(setTextContent);
            post.getAuthor().then((author) => {author.getUsername().then(setAuthor)});
            post.getImageContentUrls().then(setImageUrls);
            post.getComments().then(setComments)
            post.hasVideoContent().then(async (b) => {if(b) {
                post.getVideoThumbnailUrl().then(setThumbnailUrl);
                post.getVideoUrl().then(setVideoUrl);
            }})
        }
        fetch();
    }, [post]);

    return (
        <div className="hbox">
            <p>"{textContent}"</p>
            {imageUrls && <div>{imageUrls!.map((url) => <img src={url} className="fillHeight" style={{ width: 45, height: 45 }} alt=""/>)}</div>}
            {thumbnailUrl && <img src={thumbnailUrl} className="fillHeight" style={{ width: 45, height: 45 }} alt=""/>}
            {videoUrl && <video width="150" height="100" controls >
      <source src={videoUrl} type="video/mp4"/>
     </video>}
            <p>- {author}</p>
            <button onClick={() => {console.log(post)}}>Print Object</button>
            <button onClick={() => {getCurrentUser().then((user) => post.addLike(user))}}>Like</button>
            <button onClick={() => {getCurrentUser().then((user) => post.removeLike(user))}}>Unlike</button>
            <button onClick={() => {getCurrentUser().then(async (user) => console.log(await post.likedBy(user)))}}>Liked?</button>
            <button onClick={() => {post.delete()}}>Delete</button>
            <div>{comments.map((cmt) => <CommentDisplay comment={cmt}/>)} {comments.length} comments</div>
            <input type="text" value={newCommentText} onChange={(evt) => {setNewCommentText(evt.target.value)}} />
            <button onClick={async () => {
                await post.addComment(await getCurrentUser(), newCommentText);
                console.log("Commented")
            }}>Comment</button>
        </div>
    )
}

export default PostDisplay;