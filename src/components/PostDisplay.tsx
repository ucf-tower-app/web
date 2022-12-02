import { useEffect, useState } from "react";
import { Post } from "../xplat/types/types";

const PostDisplay = ({post}: {post: Post}) => {
    const [author, setAuthor] = useState('!!!');
    const [textContent, setTextContent] = useState("!!!");
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
    
    useEffect(() => {post.getTextContent().then((text) => setTextContent(text))}, [post]);
    useEffect(() => {
        post.getAuthor().then((author) => {author.getUsername().then((username) => setAuthor(username))});
    }, [post]);
    useEffect(() => {post.getImageContentUrl().then((url) => setImageUrl(url))}, [post]);

    
    return (
        <div className="hbox">
            <p>"{textContent}"</p>
            {imageUrl && <img src={imageUrl!} className="fillHeight" alt=""/>}
            <p>- {author}</p>

        </div>
    )
}

export default PostDisplay;