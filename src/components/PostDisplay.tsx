import { useEffect, useState } from 'react';
import { getCurrentUser } from '../xplat/api';
import { Post, Comment} from '../xplat/types/types';
import CommentDisplay from './PostDetailsComment';


const PostDisplay = ({post}: {post: Post}) => {
    const [author, setAuthor] = useState('!!!');
    const [textContent, setTextContent] = useState('!!!');
    const [imageUrls, setImageUrls] = useState<string[] | undefined>(undefined);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newCommentText, setNewCommentText] = useState<string>('nice send');
    
    useEffect(() => {
        post.getTextContent().then((text) => setTextContent(text));
        post.getAuthor().then((author) => {author.getUsername().then((username) => setAuthor(username));});
        post.getImageContentUrls().then((urls) => setImageUrls(urls));
        post.getComments().then((comments) => setComments(comments));
    }, [post]);
    // useEffect(() => {
    //     });
    // }, [post]);
    //useEffect(() => {}, [post]);

    return (
        <div className="hbox">
            <p>{textContent}</p>
            {imageUrls && <div>{imageUrls!.map((url) => 
                <img src={url} className="fillHeight" style={{ width: 45, height: 45 }} key={url} alt=""/>)}
            </div>}
            <p>- {author}</p>
            <button onClick={() => {console.log(post);}}>Print Object</button>
            <button onClick={() => {getCurrentUser().then((user) => post.addLike(user));}}>Like</button>
            <button onClick={() => {getCurrentUser().then((user) => post.removeLike(user));}}>Unlike</button>
            <button onClick={() => {getCurrentUser().then(async (user) => console.log(await post.likedBy(user)));}}>
                Liked?
            </button>
            <button onClick={() => {post.delete();}}>Delete</button>
            <div>{comments.map((cmt) => <CommentDisplay comment={cmt} key={cmt.docRef?.id}/>)} {comments.length} 
                comments</div>
            <input type="text" value={newCommentText} onChange={(evt) => {setNewCommentText(evt.target.value);}} />
            <button onClick={async () => {
                
                console.log('Commented');
            }}>Comment</button>
        </div>
    );
};

export default PostDisplay;