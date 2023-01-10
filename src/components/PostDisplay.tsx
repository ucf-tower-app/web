import { useEffect, useState } from "react";
import { getCurrentUser } from "../xplat/api";
import { Post } from "../xplat/types/types";

const PostDisplay = ({post}: {post: Post}) => {
    const [author, setAuthor] = useState('!!!');
    const [textContent, setTextContent] = useState("!!!");
    const [imageUrls, setImageUrls] = useState<string[] | undefined>(undefined);
    
    useEffect(() => {post.getTextContent().then((text) => setTextContent(text))}, [post]);
    useEffect(() => {
        post.getAuthor().then((author) => {author.getUsername().then((username) => setAuthor(username))});
    }, [post]);
    useEffect(() => {post.getImageContentUrls().then((urls) => setImageUrls(urls))}, [post]);

    return (
        <div className="hbox">
            <p>"{textContent}"</p>
            {imageUrls && <div>{imageUrls!.map((url) => <img src={url} className="fillHeight" style={{ width: 45, height: 45 }} alt=""/>)}</div>}
            <p>- {author}</p>
            <button onClick={() => {console.log(post)}}>Print Object</button>
            <button onClick={() => {getCurrentUser().then((user) => post.addLike(user))}}>Like</button>
            <button onClick={() => {getCurrentUser().then((user) => post.removeLike(user))}}>Unlike</button>
            <button onClick={() => {getCurrentUser().then(async (user) => console.log(await post.likedBy(user)))}}>Liked?</button>
            <button onClick={() => {post.delete()}}>Delete</button>
        </div>
    )
}

export default PostDisplay;