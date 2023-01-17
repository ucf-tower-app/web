/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from 'react';
import { Comment } from '../../xplat/types/types';

const CommentDisplay = ({comment}: {comment: Comment}) => {
    const [author, setAuthor] = useState('!!!');
    const [textContent, setTextContent] = useState('!!!');
    
    useEffect(() => {comment.getTextContent().then((text) => setTextContent(text));}, [comment]);
    useEffect(() => {
        comment.getAuthor().then((author) => {author.getUsername().then((username) => setAuthor(username));});
    }, [comment]);

    return (
        <div>
            <div className="hbox">
                <p>"{textContent}"</p>
                <p>- {author}</p>
                {/* <button onClick={() => {getCurrentUser().then((user) => post.addLike(user))}}>Like</button>
                <button onClick={() => {getCurrentUser().then((user) => post.removeLike(user))}}>Unlike</button>
                <button onClick={() => {getCurrentUser().then(async (user) => console.log(await post.likedBy(user)))}}>Liked?</button>
                <button onClick={() => {post.delete()}}>Delete</button> */}
            </div>
            <div className="hbox">
                <button onClick={() => {console.log(comment);}}>Print Object</button>
                {/* <button onClick={async () => {await comment.delete(); console.log('Deleted');}}>Delete</button> */}
                {/* <button onClick={async () => {await comment.edit("Big Edit Energy"); console.log("Edited")}}>Edit</button> */}
            </div>
        </div>
    );
};

export default CommentDisplay;