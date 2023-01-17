import { useEffect, useState } from 'react';
import { Forum, Post } from '../../xplat/types/types';
import PostDisplay from './PostDisplay';

const ForumDisplay = ({forum}: {forum: Forum}) => {
    const [posts, setPosts] = useState<Post[]>([]);
    
    useEffect(() => {forum.getPosts().then((_posts) => setPosts(_posts));}, [forum]);

    return (
        <ul className="forumElement">
            {posts.map(function(d, idx){
                return (
                    <li key={idx}>
                        <PostDisplay post={d}/>      
                    </li>);
            })}
        </ul>
    );
};

export default ForumDisplay;